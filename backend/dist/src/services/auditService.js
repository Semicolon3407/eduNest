import prisma from '../config/prisma.js';
export const logAction = async (action, entity, entityId, organizationId, performedBy, details = {}) => {
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
    }
    catch (error) {
        console.error('Failed to log audit:', error);
    }
};
//# sourceMappingURL=auditService.js.map