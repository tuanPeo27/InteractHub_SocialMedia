import { apiClient } from './http';
import { ApiUser } from './types';

export const usersService = {
  async getAll() {
    const response = await apiClient.get<ApiUser[]>('/Users');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiUser>(`/Users/${id}`);
    return response.data;
  },
};