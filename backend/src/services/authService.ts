import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { generateTokens } from '../utils/jwt.js';

export const registerOrgAdmin = async (orgName: string, adminEmail: string, password: string, adminName: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const slug = orgName.toLowerCase().replace(/\s+/g, '-');

  // Transaction to create Org and Admin User
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Organization
    const organization = await tx.organization.create({
      data: {
        name: orgName,
        slug,
      },
    });

    // 2. Create User linked to Org
    const user = await tx.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ORG_ADMIN',
        organizationId: organization.id,
      },
    });

    return { user, organization };
  });

  return result;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('User account is suspended');
  }

  const tokens = generateTokens(user.id, user.role);

  return { user, tokens };
};
