import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface SwipePayload {
  device_id: string;
  recipe_id: number;
  liked: boolean;
}

export const swipesApi = {
  recordSwipe: (payload: SwipePayload): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.swipes + '/', payload);
  },
};