import { apiClient } from './http';
import { ApiPost } from './types';

export const postsService = {
  async getFeed() {
    const response = await apiClient.get<ApiPost[]>('/Posts');
    return response.data;
  },

  async create(content: string, imageUrl: string | null, visibility: number) {
    const response = await apiClient.post<ApiPost>('/Posts', {
      content,
      imageUrl,
      visibility,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/Posts/${id}`);
    return response.data;
  },
};