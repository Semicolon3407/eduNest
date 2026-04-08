export declare const createGradeWithSections: (name: string, orgId: string, sectionNames: string[]) => Promise<{
    sections: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        gradeId: string;
        capacity: number | null;
    }[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
}>;
export declare const createFeeStructure: (data: {
    name: string;
    amount: number;
    organizationId: string;
    dueDate?: Date;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    amount: import("@prisma/client-runtime-utils").Decimal;
    dueDate: Date | null;
}>;
export declare const getInventory: (orgId: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    status: string | null;
    quantity: number;
    category: string | null;
}[]>;
