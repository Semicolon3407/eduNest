import api from './api';

export interface NotificationData {
  _id: string;
  type: 'PLAN_EXPIRED' | 'PLAN_EXPIRING_SOON' | 'GENERAL';
  title: string;
  message: string;
  organization?: { _id: string; name: string; email: string } | null;
  recipient: 'SUPER_ADMIN';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  getNotifications: async (): Promise<{ success: boolean; data: NotificationData[]; unreadCount: number }> => {
    const response = await api.get('/super-admin/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<{ success: boolean; data: NotificationData }> => {
    const response = await api.patch(`/super-admin/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/super-admin/notifications/read-all');
    return response.data;
  },

  checkExpiry: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/super-admin/notifications/check-expiry');
    return response.data;
  },

  createPlanExpiredNotification: async (data: {
    organizationId?: string;
    organizationName: string;
    expiryDate?: string;
  }): Promise<{ success: boolean; data: NotificationData }> => {
    const response = await api.post('/super-admin/notifications/plan-expired', data);
    return response.data;
  },
};
