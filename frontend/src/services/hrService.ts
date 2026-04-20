import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const hrService = {
  // Stats
  getStats: async () => {
    const response = await axios.get(`${API_URL}/hr/stats`, getAuthHeaders());
    return response.data;
  },

  // Staff
  getStaff: async () => {
    const response = await axios.get(`${API_URL}/hr/staff`, getAuthHeaders());
    return response.data;
  },

  onboardStaff: async (data: any) => {
    const response = await axios.post(`${API_URL}/hr/staff`, data, getAuthHeaders());
    return response.data;
  },

  updateStaff: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/hr/staff/${id}`, data, getAuthHeaders());
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await axios.delete(`${API_URL}/hr/staff/${id}`, getAuthHeaders());
    return response.data;
  },

  // Attendance
  getAttendance: async (date?: string) => {
    const response = await axios.get(`${API_URL}/hr/attendance${date ? `?date=${date}` : ''}`, getAuthHeaders());
    return response.data;
  },

  markAttendance: async (data: any) => {
    const response = await axios.post(`${API_URL}/hr/attendance`, data, getAuthHeaders());
    return response.data;
  },

  // Leaves
  getLeaves: async () => {
    const response = await axios.get(`${API_URL}/hr/leaves`, getAuthHeaders());
    return response.data;
  },

  updateLeaveStatus: async (id: string, status: string) => {
    const response = await axios.put(`${API_URL}/hr/leaves/${id}`, { status }, getAuthHeaders());
    return response.data;
  },

  // Payroll
  getPayroll: async () => {
    const response = await axios.get(`${API_URL}/hr/payroll`, getAuthHeaders());
    return response.data;
  },

  runPayroll: async (month: string, year: number) => {
    const response = await axios.post(`${API_URL}/hr/payroll/run`, { month, year }, getAuthHeaders());
    return response.data;
  },

  setupPayroll: async (data: any) => {
    const response = await axios.post(`${API_URL}/hr/payroll/setup`, data, getAuthHeaders());
    return response.data;
  },

  disburseAll: async (month: string, year: number) => {
    const response = await axios.post(`${API_URL}/hr/payroll/disburse-all`, { month, year }, getAuthHeaders());
    return response.data;
  },

  disburseIndividual: async (id: string) => {
    const response = await axios.post(`${API_URL}/hr/payroll/disburse/${id}`, {}, getAuthHeaders());
    return response.data;
  },

  getMyProfile: async () => {
    const response = await axios.get(`${API_URL}/hr/profile`, getAuthHeaders());
    return response.data;
  },

  getDocuments: async () => {
    const response = await axios.get(`${API_URL}/hr/documents`, getAuthHeaders());
    return response.data;
  },
  
  uploadStaffDocument: async (data: any) => {
    const response = await axios.post(`${API_URL}/hr/documents/upload`, data, getAuthHeaders());
    return response.data;
  },

  getBranches: async () => {
    const response = await axios.get(`${API_URL}/hr/branches`, getAuthHeaders());
    return response.data;
  }
};
