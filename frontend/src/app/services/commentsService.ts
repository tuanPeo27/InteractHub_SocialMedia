import { apiClient } from './http';
import { ApiComment } from './types';

export const commentsService = {
  async getByPost(postId: string) {
    const response = await apiClient.get<ApiComment[]>(`/Comment/post/${postId}`);
    return response.data;
  },

  async create(postId: number, content: string) {
    const response = await apiClient.post<ApiComment>('/Comment', { postId, content });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/Comment/${id}`);
    return response.data;
  },
};