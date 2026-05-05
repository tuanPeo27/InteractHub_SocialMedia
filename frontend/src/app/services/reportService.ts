import { apiClient } from './http';
import { ApiPost } from './types';


export const reportService = {
    async createReport(postId: string, reason: string) {
        const response = await apiClient.post('/reports', {
            postId,
            reason,
        });
        return response.data;
    },
};