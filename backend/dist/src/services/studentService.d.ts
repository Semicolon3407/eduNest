export declare const createStudent: (data: {
    email: string;
    name: string;
    studentId: string;
    organizationId: string;
    gradeId?: string;
    sectionId?: string;
}) => Promise<{
    user: {
        id: string;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        password: string;
        name: string;
        avatar: string | null;
        phoneNumber: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
    };
    studentProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        admissionDate: Date | null;
        birthDate: Date | null;
        gender: import("@prisma/client").$Enums.Gender | null;
        status: import("@prisma/client").$Enums.StudentStatus;
        userId: string;
        gradeId: string | null;
        sectionId: string | null;
    };
}>;
export declare const getStudentsByOrg: (orgId: string) => Promise<({
    user: {
        email: string;
        name: string;
        isActive: boolean;
    };
    grade: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
    } | null;
    section: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        gradeId: string;
        capacity: number | null;
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    admissionDate: Date | null;
    birthDate: Date | null;
    gender: import("@prisma/client").$Enums.Gender | null;
    status: import("@prisma/client").$Enums.StudentStatus;
    userId: string;
    gradeId: string | null;
    sectionId: string | null;
})[]>;
