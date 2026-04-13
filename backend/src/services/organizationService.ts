import prisma from '../config/prisma.js';

export const getDashboardMetrics = async (organizationId: string) => {
  const [branches, staffProfiles, studentCount, currentYear, totalRevenue] = await Promise.all([
    prisma.branch.findMany({
      where: { organizationId }
    }),
    prisma.staffProfile.findMany({
      where: { user: { organizationId } },
      select: { baseSalary: true }
    }),
    prisma.user.count({
        where: { organizationId, role: 'STUDENT' }
    }),
    prisma.academicYear.findFirst({
      where: { organizationId, isCurrent: true }
    }),
    prisma.feePayment.aggregate({
        where: { feeStructure: { organizationId } },
        _sum: { amountPaid: true }
    })
  ]);

  // Expenditure: Sum of staff base salaries (simulated as monthly payout)
  const totalExpenditure = staffProfiles.reduce((acc, curr) => acc + Number(curr.baseSalary || 0), 0);
  const revenueAmount = Number(totalRevenue._sum.amountPaid || 0);

  const financialSummary = {
    revenue: revenueAmount,
    expenditure: totalExpenditure,
    profit: revenueAmount - totalExpenditure
  };

  return {
    metrics: {
      totalBranches: branches.length,
      totalStaff: staffProfiles.length,
      activeStudents: studentCount,
      nextTermDate: '2025-09-15' // Placeholder
    },
    branches: branches.map(b => ({
        id: b.id,
        name: b.name,
        students: Math.floor(Math.random() * 500) + 100, // Placeholder
        revenue: '$' + (Math.floor(Math.random() * 20) + 10) + 'k'
    })),
    financialSummary,
    currentYear
  };
};

export const getOrgSettings = async (organizationId: string) => {
  return await (prisma as any).organization.findUnique({
    where: { id: organizationId },
    select: {
      name: true,
      logo: true,
      gradingScale: true,
      settings: true,
      academicYears: {
        orderBy: { startDate: 'desc' }
      }
    }
  });
};

export const updateOrgSettings = async (organizationId: string, data: any) => {
  const { name, logo, gradingScale, settings } = data;
  return await (prisma as any).organization.update({
    where: { id: organizationId },
    data: {
      name,
      logo,
      gradingScale: gradingScale || undefined,
      settings: settings || undefined
    }
  });
};

export const createBranch = async (organizationId: string, data: any) => {
    return await prisma.branch.create({
        data: {
            ...data,
            organizationId
        }
    });
};

export const getAuditLogs = async (organizationId: string) => {
  return await (prisma as any).auditLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
};

// RBAC
export const getOrgRoles = async () => {
    return ['HR', 'ADMIN', 'TUTOR'];
};

export const getAcademicSetup = async (organizationId: string) => {
    return await prisma.academicYear.findMany({
      where: { organizationId },
      orderBy: { startDate: 'desc' }
    });
};

export const createAcademicYear = async (organizationId: string, data: any) => {
    return await prisma.academicYear.create({
      data: {
        ...data,
        organizationId,
        isCurrent: data.isCurrent || false
      }
    });
};
