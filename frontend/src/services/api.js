import { getDeviceId } from '../utils/storage';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Fetch recipes from backend
 */
export const fetchRecipes = async (limit = 20) => {
  try {
    const deviceId = await getDeviceId();
    
    const response = await fetch(
      `${API_BASE_URL}/recipes/feed?device_id=${deviceId}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Send swipe to backend
 */
export const sendSwipe = async (recipeId, liked) => {
  try {
    const deviceId = await getDeviceId();
    
    const response = await fetch(`${API_BASE_URL}/swipes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_id: deviceId,
        recipe_id: recipeId,
        liked: liked,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send swipe');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending swipe:', error);
    throw error;
  }
};

/**
 * Get recipe by ID
 */
export const getRecipe = async (recipeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
    
    if (!response.ok) {
      throw new Error('Recipe not found');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};