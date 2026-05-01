import { apiClient } from './http';
import { ApiNotification } from './types';

export const notificationsService = {
  async getAll() {
    const response = await apiClient.get<ApiNotification[]>('/Notification');
    return response.data;
  },

  async create(notification: { userId: string; content: string; type: string }) {
    const response = await apiClient.post<ApiNotification>('/Notification', notification);
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await apiClient.put(`/Notification/${id}/read`);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/Notification/${id}`);
    return response.data;
  },

  async deleteAll() {
    const response = await apiClient.delete<{ message: string; deletedCount: number }>('/Notification');
    return response.data;
  },
};