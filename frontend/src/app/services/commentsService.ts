import { apiClient } from './http';
import { ApiComment } from './types';

export const commentsService = {
  async getByPost(postId: string) {
    const response = await apiClient.get<ApiComment[]>(`/comments/post/${postId}`);
    return response.data;
  },

  async create(postId: number, content: string) {
    const response = await apiClient.post<ApiComment>('/comments', { postId, content });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  },
};