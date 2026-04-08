import prisma from '../config/prisma.js';
export const createGradeWithSections = async (name, orgId, sectionNames) => {
    return await prisma.grade.create({
        data: {
            name,
            organizationId: orgId,
            sections: {
                create: sectionNames.map(s => ({ name: s })),
            },
        },
        include: { sections: true },
    });
};
export const createFeeStructure = async (data) => {
    return await prisma.feeStructure.create({
        data: {
            name: data.name,
            amount: data.amount,
            organizationId: data.organizationId,
            dueDate: data.dueDate,
        },
    });
};
export const getInventory = async (orgId) => {
    return await prisma.inventory.findMany({
        where: { organizationId: orgId },
    });
};
//# sourceMappingURL=adminService.js.map