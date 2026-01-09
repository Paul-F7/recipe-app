import { useCallback } from 'react';
import { swipesApi } from '../api';
import { getDeviceId } from '../utils/deviceId';
import { useLikedRecipes } from '../context/LikedRecipesContext';
import { useRecipeFeed } from '../context/RecipeFeedContext';
import { Recipe } from '../types';

export function useSwipe() {
  const { addLikedRecipe } = useLikedRecipes();
  const { onSwipeComplete } = useRecipeFeed();

  const recordSwipe = useCallback(async (recipe: Recipe, liked: boolean) => {
    // Save locally if liked
    if (liked) {
      addLikedRecipe(recipe);
    }

    // Send to backend FIRST (before triggering prefetch)
    try {
      const deviceId = await getDeviceId();
      await swipesApi.recordSwipe({
        device_id: deviceId,
        recipe_id: recipe.id,
        liked,
      });
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }

    // Notify feed context AFTER swipe is recorded (triggers prefetch if needed)
    onSwipeComplete();
  }, [addLikedRecipe, onSwipeComplete]);

  return { recordSwipe };
}
