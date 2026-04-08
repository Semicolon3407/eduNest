export declare const registerOrgAdmin: (orgName: string, adminEmail: string, password: string, adminName: string) => Promise<{
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
    organization: {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
        address: string | null;
        website: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        gradingScale: string | null;
        currency: string;
    };
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    user: {
        organization: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            logo: string | null;
            address: string | null;
            website: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            gradingScale: string | null;
            currency: string;
        } | null;
    } & {
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
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}>;
