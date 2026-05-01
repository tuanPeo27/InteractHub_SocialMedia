import { apiClient, authStorage, clearAuthSession, getStoredAuthToken, storeAuthSession } from './http';
import { ApiAuthResult, ApiUser } from './types';
import { User } from '../types';

export const authService = {
  authStorage,
  getStoredAuthToken,
  clearAuthSession,
  storeAuthSession,

  async login(email: string, password: string) {
    const response = await apiClient.post<ApiAuthResult>('/Auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string) {
    const response = await apiClient.post<ApiAuthResult>('/Auth/register', { email, password });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get<ApiUser>('/User/me');
    return response.data;
  },

  async updateCurrentUser(data: Partial<User>) {
    const response = await apiClient.put('/User/me', {
      userName: data.username,
      fullName: data.fullName,
      bio: data.bio,
      avatar: data.avatar,
      dateOfBirth: null,
    });
    return response.data;
  },
};