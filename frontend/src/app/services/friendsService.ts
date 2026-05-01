import { apiClient } from './http';
import { ApiFriendship } from './types';

export const friendsService = {
  async getAll() {
    const response = await apiClient.get<ApiFriendship[]>('/Friends');
    return response.data;
  },

  async sendRequest(receiverId: string) {
    const response = await apiClient.post('/Friends/request', { receiverId });
    return response.data;
  },

  async accept(id: string) {
    const response = await apiClient.post(`/Friends/accept/${id}`);
    return response.data;
  },

  async reject(id: string) {
    const response = await apiClient.post(`/Friends/reject/${id}`);
    return response.data;
  },
};