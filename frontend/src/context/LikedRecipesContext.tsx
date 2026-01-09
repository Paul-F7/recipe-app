import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIKED_RECIPES_KEY = '@recipe_app_liked_recipes';

interface LikedRecipesContextType {
  likedRecipeIds: number[];
  isLoading: boolean;
  addLikedRecipe: (id: number) => void;
  removeLikedRecipe: (id: number) => void;
  isRecipeLiked: (id: number) => boolean;
  clearLikedRecipes: () => void;
}

const LikedRecipesContext = createContext<LikedRecipesContextType | undefined>(undefined);

export function LikedRecipesProvider({ children }: { children: ReactNode }) {
  const [likedRecipeIds, setLikedRecipeIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLikedRecipes();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveLikedRecipes(likedRecipeIds);
    }
  }, [likedRecipeIds, isLoading]);

  const loadLikedRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem(LIKED_RECIPES_KEY);
      if (stored) {
        setLikedRecipeIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load liked recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLikedRecipes = async (ids: number[]) => {
    try {
      await AsyncStorage.setItem(LIKED_RECIPES_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Failed to save liked recipes:', error);
    }
  };

  const addLikedRecipe = (id: number) => {
    setLikedRecipeIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const removeLikedRecipe = (id: number) => {
    setLikedRecipeIds((prev) => prev.filter((recipeId) => recipeId !== id));
  };

  const isRecipeLiked = (id: number) => likedRecipeIds.includes(id);

  const clearLikedRecipes = () => {
    setLikedRecipeIds([]);
  };

  return (
    <LikedRecipesContext.Provider
      value={{
        likedRecipeIds,
        isLoading,
        addLikedRecipe,
        removeLikedRecipe,
        isRecipeLiked,
        clearLikedRecipes,
      }}
    >
      {children}
    </LikedRecipesContext.Provider>
  );
}

export function useLikedRecipes() {
  const context = useContext(LikedRecipesContext);
  if (!context) {
    throw new Error('useLikedRecipes must be used within a LikedRecipesProvider');
  }
  return context;
}
