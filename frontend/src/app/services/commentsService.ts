import { apiClient } from './http';
import { ApiComment } from './types';

export const commentsService = {
  async getByPost(postId: string) {
    const response = await apiClient.get<ApiComment[]>(`/Comments/post/${postId}`);
    return response.data;
  },

  async create(postId: number, content: string) {
    const response = await apiClient.post<ApiComment>('/Comments', { postId, content });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/Comments/${id}`);
    return response.data;
  },
};