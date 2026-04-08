export declare const onboardStaff: (data: {
    email: string;
    name: string;
    role: "HR" | "ADMIN" | "TUTOR";
    organizationId: string;
    staffId: string;
    designation: string;
    baseSalary?: number;
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
    staffProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StaffStatus;
        userId: string;
        staffId: string;
        designation: string;
        joiningDate: Date | null;
        baseSalary: import("@prisma/client-runtime-utils").Decimal | null;
        departmentId: string | null;
    };
}>;
export declare const getLeaveRequests: (orgId: string) => Promise<({
    staffProfile: {
        user: {
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StaffStatus;
        userId: string;
        staffId: string;
        designation: string;
        joiningDate: Date | null;
        baseSalary: import("@prisma/client-runtime-utils").Decimal | null;
        departmentId: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.LeaveStatus;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    staffProfileId: string;
})[]>;
export declare const updateLeaveStatus: (id: string, status: "APPROVED" | "REJECTED") => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.LeaveStatus;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    staffProfileId: string;
}>;
