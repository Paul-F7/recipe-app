import { useCallback } from 'react';
import { swipesApi } from '../api';
import { getDeviceId } from '../utils/deviceId';
import { useLikedRecipes } from '../context/LikedRecipesContext';
import { useRecipeFeed } from '../context/RecipeFeedContext';

export function useSwipe() {
  const { addLikedRecipe } = useLikedRecipes();
  const { onSwipeComplete } = useRecipeFeed();

  const recordSwipe = useCallback(async (recipeId: number, liked: boolean) => {
    // Save locally if liked
    if (liked) {
      addLikedRecipe(recipeId);
    }

    // Send to backend FIRST (before triggering prefetch)
    try {
      const deviceId = await getDeviceId();
      await swipesApi.recordSwipe({
        device_id: deviceId,
        recipe_id: recipeId,
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