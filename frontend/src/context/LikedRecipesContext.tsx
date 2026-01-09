import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';

const LIKED_RECIPES_KEY = '@recipe_app_liked_recipes';

interface LikedRecipesContextType {
  likedRecipes: Recipe[];
  isLoading: boolean;
  addLikedRecipe: (recipe: Recipe) => void;
  removeLikedRecipe: (id: number) => void;
  isRecipeLiked: (id: number) => boolean;
  clearLikedRecipes: () => void;
}

const LikedRecipesContext = createContext<LikedRecipesContextType | undefined>(undefined);

export function LikedRecipesProvider({ children }: { children: ReactNode }) {
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLikedRecipes();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveLikedRecipes(likedRecipes);
    }
  }, [likedRecipes, isLoading]);

  const loadLikedRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem(LIKED_RECIPES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              typeof item === 'object' &&
              item !== null &&
              Object.prototype.hasOwnProperty.call(item, 'id')
          )
        ) {
          setLikedRecipes(parsed as Recipe[]);
        }
      }
    } catch (error) {
      console.error('Failed to load liked recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLikedRecipes = async (recipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem(LIKED_RECIPES_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error('Failed to save liked recipes:', error);
    }
  };

  const addLikedRecipe = (recipe: Recipe) => {
    setLikedRecipes((prev) => {
      if (prev.some((item) => item.id === recipe.id)) return prev;
      return [recipe, ...prev];
    });
  };

  const removeLikedRecipe = (id: number) => {
    setLikedRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const isRecipeLiked = (id: number) => likedRecipes.some((recipe) => recipe.id === id);

  const clearLikedRecipes = () => {
    setLikedRecipes([]);
  };

  return (
    <LikedRecipesContext.Provider
      value={{
        likedRecipes,
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
