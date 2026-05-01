import { apiClient } from './http';
import { ApiUser } from './types';

export const usersService = {
  async getAll() {
    const response = await apiClient.get<ApiUser[]>('/users');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiUser>(`/users/${id}`);
    return response.data;
  },
};