import api from './api';

export const superAdminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/superadmin/dashboard');
    return response.data;
  },

  // Organizations
  getOrganizations: async () => {
    const response = await api.get('/superadmin/organizations');
    return response.data;
  },

  createOrganization: async (data: any) => {
    const response = await api.post('/superadmin/organizations', data);
    return response.data;
  },

  updateOrganization: async (id: string, data: any) => {
    const response = await api.put(`/superadmin/organizations/${id}`, data);
    return response.data;
  },

  updateOrgStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/superadmin/organizations/${id}/status`, { isActive });
    return response.data;
  },

  deleteOrganization: async (id: string) => {
    const response = await api.delete(`/superadmin/organizations/${id}`);
    return response.data;
  },

  // Subscriptions
  getSubscriptionPlans: async () => {
    const response = await api.get('/superadmin/subscription-plans');
    return response.data;
  },

  createSubscriptionPlan: async (data: any) => {
    const response = await api.post('/superadmin/subscription-plans', data);
    return response.data;
  },

  getBillingHistory: async () => {
    const response = await api.get('/superadmin/billing/history');
    return response.data;
  },

  getRenewals: async () => {
    const response = await api.get('/superadmin/billing/renewals');
    return response.data;
  },

  getSubscriptionMetrics: async () => {
    const response = await api.get('/superadmin/billing/metrics');
    return response.data;
  },

  // Config
  getConfig: async () => {
    const response = await api.get('/superadmin/config');
    return response.data;
  },

  updateConfig: async (key: string, value: string) => {
    const response = await api.post('/superadmin/config', { key, value });
    return response.data;
  },
};
