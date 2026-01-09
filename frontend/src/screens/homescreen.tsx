import React, { useLayoutEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ChefHat, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/theme';
import SwipeableCard from '../components/SwipeableCard';
import LoadingAnimation from '../components/LoadingAnimation';
import { useSwipe } from '../hooks/useSwipe';
import { useRecipeFeed } from '../context/RecipeFeedContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function HomeScreen() {
  const { recipes, currentIndex, isLoading, error, refreshFeed, isFetchingMore } = useRecipeFeed();
  const { recordSwipe } = useSwipe();
  const position = useRef(new Animated.Value(0)).current;

  // Use refs to always have access to latest values in panResponder callbacks
  const currentIndexRef = useRef(currentIndex);
  const recipesRef = useRef(recipes);
  const recordSwipeRef = useRef(recordSwipe);

  // Keep refs in sync
  currentIndexRef.current = currentIndex;
  recipesRef.current = recipes;
  recordSwipeRef.current = recordSwipe;

  useLayoutEffect(() => {
    position.stopAnimation(() => {
      position.setValue(0);
    });
  }, [currentIndex, position]);

  const forceSwipeRef = useRef((direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: x,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      const idx = currentIndexRef.current;
      const recipe = recipesRef.current[idx];
      if (recipe) {
        const liked = direction === 'right';
        void recordSwipeRef.current(recipe.id, liked);
      }
    });
  });

  const resetPositionRef = useRef(() => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  });

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        position.stopAnimation();
      },
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipeRef.current('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipeRef.current('left');
        } else {
          resetPositionRef.current();
        }
      },
    })
  ).current;

  const getCardStyle = () => {
    const rotate = position.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
    });
    return {
      transform: [{ translateX: position }, { rotate }],
    };
  };

  const getLikeOpacity = () =>
    position.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const getNopeOpacity = () =>
    position.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

  const getNextCardBlurOpacity = () =>
    position.interpolate({
      inputRange: [-SWIPE_THRESHOLD * 5, 0, SWIPE_THRESHOLD * 5],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

  const renderCards = () => {
    // Loading state
    if (isLoading) {
      return <LoadingAnimation message="Finding recipes for you..." />;
    }

    // Error state
    if (error) {
      return (
        <View style={styles.noMoreCards}>
          <ChefHat size={80} color={Colors.dark.textSecondary} />
          <Text style={styles.noMoreText}>Oops!</Text>
          <Text style={styles.noMoreSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshFeed}>
            <RefreshCw size={20} color={Colors.dark.textPrimary} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // No more recipes
    if (currentIndex >= recipes.length) {
      // Show loading animation if fetching more
      if (isFetchingMore) {
        return <LoadingAnimation message="Loading more recipes..." />;
      }

      return (
        <View style={styles.noMoreCards}>
          <ChefHat size={80} color={Colors.dark.textSecondary} />
          <Text style={styles.noMoreText}>No more recipes!</Text>
          <Text style={styles.noMoreSubtext}>Check back later for more delicious ideas</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshFeed}>
            <RefreshCw size={20} color={Colors.dark.textPrimary} />
            <Text style={styles.retryText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Render recipe cards
    return recipes
      .map((recipe, index) => {
        if (index < currentIndex) return null;

        const isActive = index === currentIndex;
        const isNext = index === currentIndex + 1;
        const stackOffset = Math.max(0, index - currentIndex - 1) * 10;
        return (
          <SwipeableCard
            key={recipe.id}
            recipe={recipe}
            isActive={isActive}
            stackOffset={stackOffset}
            panHandlers={isActive ? panResponder.panHandlers : undefined}
            cardStyle={isActive ? getCardStyle() : undefined}
            blurOpacity={isNext ? getNextCardBlurOpacity() : undefined}
            likeOpacity={isActive ? getLikeOpacity() : undefined}
            nopeOpacity={isActive ? getNopeOpacity() : undefined}
          />
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#1a0a0a', '#0a0a0a']} style={StyleSheet.absoluteFill} />
      <View style={styles.cardsContainer}>{renderCards()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginTop: 20,
  },
  noMoreSubtext: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.dark.accent,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
  },
});
