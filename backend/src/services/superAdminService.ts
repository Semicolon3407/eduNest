import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

export const getAllOrganizations = async () => {
  return await prisma.organization.findMany({
    include: {
      _count: {
        select: { users: true, branches: true },
      },
    },
  });
};

export const updateOrgStatus = async (id: string, isActive: boolean) => {
  return await prisma.organization.update({
    where: { id },
    data: { isActive },
  });
};

export const getGlobalMetrics = async () => {
  const totalOrgs = await prisma.organization.count();
  const activeUsers = await prisma.user.count({ where: { isActive: true } });
  const totalRevenue = 0; // Placeholder for billing integration

  return { totalOrgs, activeUsers, totalRevenue };
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
    const admin = await tx.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ORG_ADMIN',
        organizationId: organization.id,
      },
    });

    return { organization, admin };
  });
};

export const deleteOrganization = async (id: string) => {
  return await prisma.organization.delete({
    where: { id },
  });
};
