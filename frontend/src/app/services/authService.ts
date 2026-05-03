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

  async register(email: string, password: string, userName?: string, fullName?: string) {
    const response = await apiClient.post<ApiAuthResult>('/Auth/register', {
      email,
      password,
      userName,
      fullName,
    });
    return response.data;
  },    

  async logout() {
    await apiClient.post('/Auth/logout');
    clearAuthSession();
  },

  async forgotPassword(email: string) {
    await apiClient.post('/Auth/forgot-password', { email });
  },

  async resetPassword(email: string, token: string, newPassword: string) {
    await apiClient.post('/Auth/reset-password', { email, token, newPassword });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    await apiClient.post('/Auth/change-password', { currentPassword, newPassword });
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
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth || null,
    });

    return response.data;
  },
};