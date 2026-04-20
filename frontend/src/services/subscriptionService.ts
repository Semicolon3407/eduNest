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

export interface SubscriptionData {
  _id?: string;
  name: string;
  price: number;
  duration: 'Monthly' | '3 Months' | '6 Months' | 'Annual';
  features: string[];
  status: 'Active' | 'Inactive';
}

export const subscriptionService = {
  getSubscriptions: async () => {
    const response = await axios.get(`${API_URL}/super-admin/subscriptions`, getAuthHeaders());
    return response.data;
  },

  createSubscription: async (data: SubscriptionData) => {
    const response = await axios.post(`${API_URL}/super-admin/subscriptions`, data, getAuthHeaders());
    return response.data;
  },

  updateSubscription: async (id: string, data: Partial<SubscriptionData>) => {
    const response = await axios.put(`${API_URL}/super-admin/subscriptions/${id}`, data, getAuthHeaders());
    return response.data;
  },

  deleteSubscription: async (id: string) => {
    const response = await axios.delete(`${API_URL}/super-admin/subscriptions/${id}`, getAuthHeaders());
    return response.data;
  }
};
