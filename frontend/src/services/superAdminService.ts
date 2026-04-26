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
  status?: 'Active' | 'Pending' | 'Suspended';
  subscription?: string;
}

export const superAdminService = {
  // Organization Management
  getOrganizations: async () => {
    const response = await api.get('/super-admin/organizations');
    return response.data;
  },

  getOrganizationById: async (id: string) => {
    const response = await api.get(`/super-admin/organizations/${id}`);
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

  recalculateSubscriptionDates: async (id: string) => {
    const response = await api.patch(`/super-admin/organizations/${id}/recalculate-dates`);
    return response.data;
  },

  backfillAllDates: async () => {
    const response = await api.post('/super-admin/organizations/backfill-dates');
    return response.data;
  },

  getTickets: async () => {
    const response = await api.get('/super-admin/tickets');
    return response.data;
  },

  updateTicket: async (id: string, data: { status?: string; resolutionNotes?: string; replyMessage?: string }) => {
    const response = await api.patch(`/super-admin/tickets/${id}`, data);
    return response.data;
  },
};
