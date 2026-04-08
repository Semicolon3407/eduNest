import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export const onboardStaff = async (data: {
  email: string;
  name: string;
  role: 'HR' | 'ADMIN' | 'TUTOR';
  organizationId: string;
  staffId: string;
  designation: string;
  baseSalary?: number;
}) => {
  const hashedPassword = await bcrypt.hash('staff123', 10);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        organizationId: data.organizationId,
      },
    });

    const staffProfile = await tx.staffProfile.create({
      data: {
        userId: user.id,
        staffId: data.staffId,
        designation: data.designation,
        baseSalary: data.baseSalary,
      },
    });

    return { user, staffProfile };
  });
};

export const getLeaveRequests = async (orgId: string) => {
  return await prisma.leaveRequest.findMany({
    where: {
      staffProfile: {
        user: { organizationId: orgId },
      },
    },
    include: {
      staffProfile: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });
};

export const updateLeaveStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
  return await prisma.leaveRequest.update({
    where: { id },
    data: { status },
  });
};
