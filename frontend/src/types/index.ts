export type UserRole = 'SUPER_ADMIN' | 'ORGANIZATION' | 'HR' | 'ADMINISTRATOR' | 'TUTOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
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
