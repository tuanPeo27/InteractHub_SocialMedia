import { apiClient } from './http';
import { ApiStory } from './types';

export const storiesService = {
  async getFeed() {
    const response = await apiClient.get<ApiStory[]>('/stories/feed');
    return response.data;
  },

  async create(imageUrl: string) {
    const response = await apiClient.post<ApiStory>('/stories', {
      imageUrl,
      visibility: 0,
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/stories/${id}`);
    return response.data;
  },
};