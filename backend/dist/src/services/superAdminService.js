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
export const updateOrgStatus = async (id, isActive) => {
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
//# sourceMappingURL=superAdminService.js.map