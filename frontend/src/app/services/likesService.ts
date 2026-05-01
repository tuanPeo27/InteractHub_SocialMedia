import { apiClient } from './http';
import { ApiLikeInfo } from './types';

export const likesService = {
  async toggle(postId: string) {
    const response = await apiClient.post<{ isLiked: boolean }>(`/Like/${postId}`);
    return response.data;
  },

  async getInfo(postId: string) {
    const response = await apiClient.get<ApiLikeInfo>(`/Like/${postId}`);
    return response.data;
  },
};