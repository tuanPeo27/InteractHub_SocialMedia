import { apiClient } from './http';
import { ApiNotification } from './types';

export const notificationsService = {
  async getAll() {
    const response = await apiClient.get<ApiNotification[]>('/notifications');
    return response.data;
  },

  async create(notification: { userId: string; content: string; type: string }) {
    const response = await apiClient.post<ApiNotification>('/notifications', notification);
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};