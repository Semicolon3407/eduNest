import prisma from '../config/prisma.js';

export const logAction = async (
  action: string,
  entity: string,
  entityId: string | null,
  organizationId: string,
  performedBy: string,
  details: any = {}
) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        organizationId,
        performedBy,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};
