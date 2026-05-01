import { apiClient } from './http';
import type { ApiAdminUser, ApiReport } from './types';

export const adminService = {
  async getUsers() {
    const response = await apiClient.get<unknown[]>('/admin/users');
    return (response.data || []).map((item) => {
      const record = item as Record<string, unknown>;
      return {
        id: (record.id ?? record.Id) as string,
        userName: (record.userName ?? record.UserName ?? '') as string,
        email: (record.email ?? record.Email ?? '') as string,
        isLocked: Boolean(record.isLocked ?? record.IsLocked),
        roles: (record.roles ?? record.Roles ?? []) as string[],
        fullName: (record.fullName ?? record.FullName) as string | null | undefined,
        phoneNumber: (record.phoneNumber ?? record.PhoneNumber) as string | null | undefined,
        avatar: (record.avatar ?? record.Avatar) as string | null | undefined,
        bio: (record.bio ?? record.Bio) as string | null | undefined,
        dateOfBirth: (record.dateOfBirth ?? record.DateOfBirth) as string | null | undefined,
      } as ApiAdminUser;
    });
  },

  async getReports() {
    const response = await apiClient.get<ApiReport[]>('/admin/reports');
    return response.data;
  },

  async deletePost(postId: string) {
    const response = await apiClient.delete(`/admin/posts/${postId}`);
    return response.data;
  },

  async banUser(userId: string) {
    const response = await apiClient.post(`/admin/ban-user/${userId}`);
    return response.data;
  },

  async unbanUser(userId: string) {
    const response = await apiClient.post(`/admin/unban-user/${userId}`);
    return response.data;
  },

  async setUserRole(userId: string, roleName: string) {
    const response = await apiClient.post('/admin/set-role', {
      userId,
      roleName,
    });
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await apiClient.delete(`/User/${userId}`);
    return response.data;
  },
};
