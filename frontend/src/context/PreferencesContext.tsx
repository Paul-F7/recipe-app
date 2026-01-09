import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DishType, DietType, UserPreferences } from '../types';

const PREFERENCES_KEY = '@recipe_app_preferences';

interface PreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  setCategories: (categories: DishType[]) => void;
  setDiets: (diets: DietType[]) => void;
  toggleCategory: (category: DishType) => void;
  toggleDiet: (diet: DietType) => void;
}

const defaultPreferences: UserPreferences = {
  categories: ['breakfast', 'lunch', 'dinner', 'dessert', 'drink'],
  diets: [],
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      savePreferences(preferences);
    }
  }, [preferences, isLoading]);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (prefs: UserPreferences) => {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const setCategories = (categories: DishType[]) => {
    setPreferences((prev) => ({ ...prev, categories }));
  };

  const setDiets = (diets: DietType[]) => {
    setPreferences((prev) => ({ ...prev, diets }));
  };

  const toggleCategory = (category: DishType) => {
    setPreferences((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const toggleDiet = (diet: DietType) => {
    setPreferences((prev) => {
      const currentDiets = prev.diets || [];
      const diets = currentDiets.includes(diet)
        ? currentDiets.filter((d) => d !== diet)
        : [...currentDiets, diet];
      return { ...prev, diets };
    });
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, isLoading, setCategories, setDiets, toggleCategory, toggleDiet }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
