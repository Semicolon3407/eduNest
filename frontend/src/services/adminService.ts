import api from './api';

export const adminService = {
  // Stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Students
  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  updateStudent: async (id: string, data: any) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  enrollStudent: async (studentData: any) => {
    const response = await api.post('/admin/students/enroll', studentData);
    return response.data;
  },

  // Fees
  getFees: async () => {
    const response = await api.get('/admin/fees');
    return response.data;
  },

  createFee: async (data: any) => {
    const response = await api.post('/admin/fees', data);
    return response.data;
  },

  updateFee: async (id: string, data: any) => {
    const response = await api.put(`/admin/fees/${id}`, data);
    return response.data;
  },

  deleteFee: async (id: string) => {
    const response = await api.delete(`/admin/fees/${id}`);
    return response.data;
  },

  // Schedules
  getSchedules: async (params: any) => {
    const response = await api.get('/admin/schedules', { params });
    return response.data;
  },

  createSchedule: async (data: any) => {
    const response = await api.post('/admin/schedules', data);
    return response.data;
  },

  deleteSchedule: async (id: string) => {
    const response = await api.delete(`/admin/schedules/${id}`);
    return response.data;
  },

  // Classes
  getClasses: async () => {
    const response = await api.get('/admin/classes');
    return response.data;
  },

  createClass: async (classData: any) => {
    const response = await api.post('/admin/classes', classData);
    return response.data;
  },

  deleteClass: async (id: string) => {
    const response = await api.delete(`/admin/classes/${id}`);
    return response.data;
  },

  // Inventory
  getInventory: async () => {
    const response = await api.get('/admin/inventory');
    return response.data;
  },

  createAsset: async (assetData: any) => {
    const response = await api.post('/admin/inventory', assetData);
    return response.data;
  },
};
