export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'HR' | 'ADMIN' | 'TUTOR' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
  organization?: Organization;
  branchId?: string;
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  status: 'active' | 'suspended' | 'pending';
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  createdAt: string;
}
