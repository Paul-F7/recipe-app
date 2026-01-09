import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { getDeviceId } from '../utils/deviceId';
import { Recipe, DishType, DietType } from '../types';

export interface GetFeedParams {
  limit?: number;
  categories?: DishType[];
  diets?: DietType[];
}

export const recipesApi = {
  getFeed: async (params: GetFeedParams = {}): Promise<Recipe[]> => {
    const deviceId = await getDeviceId();
    const { limit = 5, categories, diets } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('device_id', deviceId);
    queryParams.append('limit', String(limit));

    if (categories?.length) {
      categories.forEach((c) => queryParams.append('categories', c));
    }
    if (diets?.length) {
      diets.forEach((d) => queryParams.append('diets', d));
    }

    return apiClient.get<Recipe[]>(`${API_ENDPOINTS.recipes}/feed?${queryParams}`);
  },
};
