import api from './api';
import type { LoginCredentials, AuthResponse, User } from '../types/auth.ts';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.get('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; data: string }> => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<AuthResponse> => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },
};
