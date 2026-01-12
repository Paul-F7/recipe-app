import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';
import { recipesApi } from '../api/recipes';
import { usePreferences } from './PreferencesContext';

const FEED_CACHE_KEY = '@recipe_app_feed_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const BATCH_SIZE = 5;
const REFETCH_THRESHOLD = 2;

interface FeedCache {
  recipes: Recipe[];
  timestamp: number;
}

interface RecipeFeedContextType {
  recipes: Recipe[];
  currentIndex: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  hasMore: boolean;
  fetchInitialRecipes: () => Promise<void>;
  onSwipeComplete: () => void;
  refreshFeed: () => Promise<void>;
  currentRecipe: Recipe | null;
  remainingCount: number;
}

const RecipeFeedContext = createContext<RecipeFeedContextType | undefined>(undefined);

export function RecipeFeedProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { preferences, isLoading: preferencesLoading } = usePreferences();
  const [hasInitialized, setHasInitialized] = useState(false);
  const fetchIdRef = useRef(0);

  // Load cached feed on mount
  useEffect(() => {
    loadCachedFeed();
  }, []);

  // Refetch recipes when preferences change (after initial load)
  useEffect(() => {
    if (preferencesLoading || !hasInitialized) return;

    // Clear cache and fetch new recipes with updated preferences
    AsyncStorage.removeItem(FEED_CACHE_KEY);
    fetchInitialRecipes();
  }, [preferences.categories, preferences.diets]);

  const loadCachedFeed = async () => {
    try {
      const cached = await AsyncStorage.getItem(FEED_CACHE_KEY);
      if (cached) {
        const { recipes: cachedRecipes, timestamp }: FeedCache = JSON.parse(cached);
        const isStale = Date.now() - timestamp > CACHE_TTL_MS;

        if (!isStale && cachedRecipes.length > 0) {
          setRecipes(cachedRecipes);
          setIsLoading(false);
          setHasInitialized(true);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load cached feed:', err);
    }

    // No valid cache, fetch fresh
    await fetchInitialRecipes();
    setHasInitialized(true);
  };

  const saveFeedToCache = async (recipesToCache: Recipe[]) => {
    try {
      const cache: FeedCache = {
        recipes: recipesToCache,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(FEED_CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.error('Failed to cache feed:', err);
    }
  };

  const fetchInitialRecipes = useCallback(async () => {
    const fetchId = fetchIdRef.current + 1;
    fetchIdRef.current = fetchId;
    setIsLoading(true);
    setError(null);

    try {
      const newRecipes = await recipesApi.getFeed({
        limit: BATCH_SIZE,
        categories: preferences.categories,
        diets: preferences.diets || undefined,
      });

      if (fetchId !== fetchIdRef.current) return;

      setRecipes(newRecipes);
      setCurrentIndex(0);
      setHasMore(newRecipes.length === BATCH_SIZE);

      if (newRecipes.length > 0 && fetchId === fetchIdRef.current) {
        await saveFeedToCache(newRecipes);
      }
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;
      const message = err instanceof Error ? err.message : 'Failed to fetch recipes';
      setError(message);
      console.error('Failed to fetch initial recipes:', err);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [preferences.categories, preferences.diets]);

  const fetchMoreRecipes = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);

    try {
      const newRecipes = await recipesApi.getFeed({
        limit: BATCH_SIZE,
        categories: preferences.categories,
        diets: preferences.diets || undefined,
      });

      if (newRecipes.length === 0) {
        setHasMore(false);
        return;
      }

      // Deduplicate using functional update to get latest state
      setRecipes((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const uniqueNew = newRecipes.filter((r) => !existingIds.has(r.id));

        if (uniqueNew.length === 0) {
          return prev;
        }

        return [...prev, ...uniqueNew];
      });

      setHasMore(newRecipes.length === BATCH_SIZE);
    } catch (err) {
      // Silent fail for prefetch - don't block UI
      console.error('Failed to fetch more recipes:', err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, preferences.categories, preferences.diets]);

  const onSwipeComplete = useCallback(() => {
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    const remaining = recipes.length - newIndex;
    const remainingRecipes = recipes.slice(newIndex);

    InteractionManager.runAfterInteractions(() => {
      if (remaining <= REFETCH_THRESHOLD && hasMore && !isFetchingMore) {
        fetchMoreRecipes();
      }

      if (remainingRecipes.length > 0) {
        saveFeedToCache(remainingRecipes);
      }
    });
  }, [currentIndex, recipes, hasMore, isFetchingMore, fetchMoreRecipes, saveFeedToCache]);

  const refreshFeed = useCallback(async () => {
    setCurrentIndex(0);
    await fetchInitialRecipes();
  }, [fetchInitialRecipes]);

  const currentRecipe = recipes[currentIndex] || null;
  const remainingCount = recipes.length - currentIndex;

  return (
    <RecipeFeedContext.Provider
      value={{
        recipes,
        currentIndex,
        isLoading,
        isFetchingMore,
        error,
        hasMore,
        fetchInitialRecipes,
        onSwipeComplete,
        refreshFeed,
        currentRecipe,
        remainingCount,
      }}
    >
      {children}
    </RecipeFeedContext.Provider>
  );
}

export function useRecipeFeed() {
  const context = useContext(RecipeFeedContext);
  if (!context) {
    throw new Error('useRecipeFeed must be used within a RecipeFeedProvider');
  }
  return context;
}
