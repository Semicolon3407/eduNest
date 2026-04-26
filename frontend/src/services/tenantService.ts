import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1/tenant';
const API_URL_PAYMENT = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1') + '/payment';

// Add interceptor to include token in requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const tenantService = {
  // Branch Management
  getBranches: async () => {
    const response = await axios.get(`${API_URL}/branches`, getAuthHeaders());
    return response.data;
  },

  addBranch: async (branchData: any) => {
    const response = await axios.post(`${API_URL}/branches`, branchData, getAuthHeaders());
    return response.data;
  },

  updateBranch: async (id: string, branchData: any) => {
    const response = await axios.put(`${API_URL}/branches/${id}`, branchData, getAuthHeaders());
    return response.data;
  },

  deleteBranch: async (id: string) => {
    const response = await axios.delete(`${API_URL}/branches/${id}`, getAuthHeaders());
    return response.data;
  },

  // Staff Management
  getStaff: async () => {
    const response = await axios.get(`${API_URL}/staff`, getAuthHeaders());
    return response.data;
  },

  onboardStaff: async (staffData: any) => {
    const response = await axios.post(`${API_URL}/staff`, staffData, getAuthHeaders());
    return response.data;
  },

  updateStaff: async (id: string, staffData: any) => {
    const response = await axios.put(`${API_URL}/staff/${id}`, staffData, getAuthHeaders());
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await axios.delete(`${API_URL}/staff/${id}`, getAuthHeaders());
    return response.data;
  },

  // Profile Management
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
    return response.data;
  },

  updateProfile: async (orgData: any) => {
    const response = await axios.put(`${API_URL}/profile`, orgData, getAuthHeaders());
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await axios.get(`${API_URL}/subscriptions`, getAuthHeaders());
    return response.data;
  },

  buyPlan: async (subscriptionId: string) => {
    const response = await axios.post(`${API_URL}/buy-plan`, { subscriptionId }, getAuthHeaders());
    return response.data;
  },

  createPaymentIntent: async (subscriptionId: string) => {
    const response = await axios.post(`${API_URL_PAYMENT}/stripe/create-intent`, { subscriptionId }, getAuthHeaders());
    return response.data;
  }
};
