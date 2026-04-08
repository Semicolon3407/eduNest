export declare const getAllOrganizations: () => Promise<({
    _count: {
        users: number;
        branches: number;
    };
} & {
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
})[]>;
export declare const updateOrgStatus: (id: string, isActive: boolean) => Promise<{
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
}>;
export declare const getGlobalMetrics: () => Promise<{
    totalOrgs: number;
    activeUsers: number;
    totalRevenue: number;
}>;
