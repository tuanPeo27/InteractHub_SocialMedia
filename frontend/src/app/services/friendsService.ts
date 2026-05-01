import { apiClient } from './http';
import { ApiFriendship } from './types';

export const friendsService = {
  async getAll() {
    const response = await apiClient.get<ApiFriendship[]>('/friends');
    return response.data;
  },

  async sendRequest(receiverId: string) {
    const response = await apiClient.post('/friends/request', { receiverId });
    return response.data;
  },

  async accept(id: string) {
    const response = await apiClient.post(`/friends/accept/${id}`);
    return response.data;
  },

  async reject(id: string) {
    const response = await apiClient.post(`/friends/reject/${id}`);
    return response.data;
  },

  async recieveedRequests() {
    const response = await apiClient.get<ApiFriendship[]>('/friends/received');
    return response.data;
  },

  async removeFriend(userId: string) {
    const response = await apiClient.delete(`/friends/unfriend/${userId}`);
    return response.data;
  }
};