import { apiClient } from './http';
import { ApiNotification } from './types';

export const notificationsService = {
  async getAll() {
    const response = await apiClient.get<ApiNotification[]>('/Notifications');
    return response.data;
  },

  async create(notification: { userId: string; content: string; type: string }) {
    const response = await apiClient.post<ApiNotification>('/Notifications', notification);
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await apiClient.put(`/Notifications/${id}/read`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/Notifications/${id}`);
    return response.data;
  },
};