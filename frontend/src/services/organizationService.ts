import api from './api';

export const organizationService = {
  getDashboard: async () => {
    const response = await api.get('/organization/dashboard');
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/organization/settings');
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await api.put('/organization/settings', data);
    return response.data;
  },

  createBranch: async (data: any) => {
    const response = await api.post('/organization/branches', data);
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await api.get('/organization/audit-logs');
    return response.data;
  },

  getAcademicSetup: async () => {
    const response = await api.get('/organization/academic-setup');
    return response.data;
  },

  createAcademicYear: async (data: any) => {
    const response = await api.post('/organization/academic-year', data);
    return response.data;
  }
};
