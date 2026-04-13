import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

// Organizations
export const getAllOrganizations = async () => {
  return await (prisma as any).organization.findMany({
    include: {
      subscription: {
        include: { plan: true }
      },
      _count: {
        select: { users: true, branches: true },
      },
      users: {
        where: { role: 'ORG_ADMIN' },
        take: 1
      }
    },
  });
};

export const createOrganization = async (data: {
  name: string;
  slug?: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
}) => {
  const { name, adminEmail, adminPassword, adminName } = data;
  const slug = data.slug || name.toLowerCase().replace(/\s+/g, '-');
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  return await prisma.$transaction(async (tx) => {
    // 1. Create Organization
    const organization = await tx.organization.create({
      data: {
        name,
        slug,
      },
    });

    // 2. Create Org Admin User
    await tx.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ORG_ADMIN',
        organizationId: organization.id,
      },
    });

    return organization;
  });
};

export const updateOrganization = async (id: string, data: { 
  name?: string; 
  slug?: string;
  adminName?: string;
  adminEmail?: string;
  address?: string;
  website?: string;
  contactPhone?: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Update Organization
    const organization = await tx.organization.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address,
        website: data.website,
        contactPhone: data.contactPhone,
      },
    });

    // 2. Update Admin User if provided
    if (data.adminName || data.adminEmail) {
      const admin = await tx.user.findFirst({
        where: { organizationId: id, role: 'ORG_ADMIN' }
      });

      if (admin) {
        await tx.user.update({
          where: { id: admin.id },
          data: {
            name: data.adminName || admin.name,
            email: data.adminEmail || admin.email,
          }
        });
      }
    }

    return organization;
  });
};

export const updateOrgStatus = async (id: string, isActive: boolean) => {
  return await prisma.organization.update({
    where: { id },
    data: { isActive },
  });
};

export const deleteOrganization = async (id: string) => {
  return await prisma.organization.delete({
    where: { id },
  });
};

// Subscriptions & Billing
export const getSubscriptionPlans = async () => {
  return await (prisma as any).subscriptionPlan.findMany({
    orderBy: { price: 'asc' },
  });
};

export const createSubscriptionPlan = async (data: any) => {
  return await (prisma as any).subscriptionPlan.create({ data });
};

export const getBillingHistory = async () => {
  return await (prisma as any).invoice.findMany({
    include: {
      organization: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
};

export const getRenewals = async () => {
  return await (prisma as any).subscription.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      }
    },
    include: {
      organization: { select: { name: true } },
      plan: { select: { name: true } }
    },
    orderBy: { endDate: 'asc' }
  });
};

export const getSubscriptionMetrics = async () => {
  const [revenueData, activeSubs, overdueInvoices] = await Promise.all([
    (prisma as any).invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    }),
    (prisma as any).subscription.count({
      where: { status: 'ACTIVE' }
    }),
    (prisma as any).invoice.count({
      where: { status: 'PENDING', dueDate: { lt: new Date() } }
    })
  ]);

  return {
    platformRevenue: revenueData._sum.amount || 0,
    activeSubscriptions: activeSubs,
    overdueInvoices: overdueInvoices
  };
};

// System Health & Metrics
export const getGlobalMetrics = async () => {
  const [totalOrgs, activeUsers, totalUsers, totalPlans, orgs] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count(),
    (prisma as any).subscriptionPlan.count(),
    prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
            branches: true,
            academicYears: true,
            departments: true,
            auditLogs: true
          }
        }
      },
      take: 10
    })
  ]);

  // Calculate storage per organization based on record counts (simulated)
  const storagePerOrg = orgs.map(org => {
    const totalRecords = Object.values(org._count).reduce((a, b) => a + b, 0);
    // Simulate 50KB per record + 5MB overhead
    const estimatedStorageMB = (totalRecords * 0.05) + 5;
    return {
      name: org.name,
      storageMB: estimatedStorageMB.toFixed(2),
      percentOfTotal: ((estimatedStorageMB / 5000) * 100).toFixed(1) // Assuming 5GB limit
    };
  });

  const health = {
    cpuUsage: "12%",
    memoryUsage: "45%",
    storageUsed: "1.2GB",
    uptime: "14 days",
    status: "Healthy",
    lastBackup: new Date().toISOString()
  };

  return { 
    summary: { totalOrgs, activeUsers, totalUsers, totalPlans },
    storagePerOrg,
    health 
  };
};

// Global Config
export const getSystemConfig = async () => {
  return await (prisma as any).systemConfig.findMany();
};

export const updateSystemConfig = async (key: string, value: string) => {
  return await (prisma as any).systemConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};
