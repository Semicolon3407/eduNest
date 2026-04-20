import api from './api';

export interface OrganizationData {
  name: string;
  type: string;
  location: string;
  email: string;
  password?: string;
  personalEmail: string;
  phone: string;
  branchCount?: number;
  subscriptionPlan?: string;
  status?: 'Active' | 'Pending' | 'Suspended';
}

export interface SubscriptionPlanData {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export const superAdminService = {
  // Organization Management
  getOrganizations: async () => {
    const response = await api.get('/super-admin/organizations');
    return response.data;
  },

  createOrganization: async (data: OrganizationData) => {
    const response = await api.post('/super-admin/organizations', data);
    return response.data;
  },

  updateOrganization: async (id: string, data: Partial<OrganizationData>) => {
    const response = await api.put(`/super-admin/organizations/${id}`, data);
    return response.data;
  },

  deleteOrganization: async (id: string) => {
    const response = await api.delete(`/super-admin/organizations/${id}`);
    return response.data;
  },

  updateOrganizationStatus: async (id: string, status: string) => {
    const response = await api.patch(`/super-admin/organizations/${id}/status`, { status });
    return response.data;
  },

  // Subscription Management
  getPlans: async () => {
    const response = await api.get('/super-admin/plans');
    return response.data;
  },

  updatePlan: async (id: string, data: Partial<SubscriptionPlanData>) => {
    const response = await api.put(`/super-admin/plans/${id}`, data);
    return response.data;
  },
};
