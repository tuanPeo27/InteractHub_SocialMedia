import { apiClient } from './http';
import { ApiPost } from './types';

export const postsService = {
  async getFeed() {
    const response = await apiClient.get<ApiPost[]>('/posts');
    return response.data;
  },

  async create(content: string, imageUrl: string | null) {
    const response = await apiClient.post<ApiPost>('/posts', {
      content,
      imageUrl,
      visibility: 0,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};