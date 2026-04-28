import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import { ChefHat, Leaf, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../constants/theme';
import PressableScale from '../components/PressableScale';
import SwipeableCard from '../components/SwipeableCard';
import LoadingAnimation from '../components/LoadingAnimation';
import { useSwipe } from '../hooks/useSwipe';
import { useRecipeFeed } from '../context/RecipeFeedContext';
import { getImageUrl } from '../constants/images';
import { CARD_MAX_WIDTH, CARD_MAX_HEIGHT } from '../constants/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const SWIPE_ACTIVATION_DISTANCE = 2;
const SWIPE_ACTIVATION_VELOCITY = 0.14;
const SWIPE_DIRECTIONAL_OFFSET = 0;
const SWIPE_VERTICAL_SLOP = 14;
const SWIPE_RELEASE_VELOCITY = 0.25;
const PREFETCH_AHEAD = 3;
const PRESS_RETENTION_OFFSET = { top: 8, bottom: 8, left: 8, right: 8 };

export default function HomeScreen() {
  const navigation = useNavigation();
  const { recipes, currentIndex, isLoading, error, refreshFeed, isFetchingMore } = useRecipeFeed();
  const { recordSwipe } = useSwipe();
  const position = useMemo(() => new Animated.Value(0), [currentIndex]);
  const overlayOpacity = useMemo(() => new Animated.Value(0), [currentIndex]);
  const isAnimatingRef = useRef(false);
  const positionValueRef = useRef(0);
  const prefetchedUrlsRef = useRef(new Set<string>());
  const panResponderMove = useMemo(
    () =>
      Animated.event([null, { dx: position }], {
        useNativeDriver: false,
      }),
    [position]
  );

  // Use refs to always have access to latest values in panResponder callbacks
  const currentIndexRef = useRef(currentIndex);
  const recipesRef = useRef(recipes);
  const recordSwipeRef = useRef(recordSwipe);

  // Keep refs in sync
  currentIndexRef.current = currentIndex;
  recipesRef.current = recipes;
  recordSwipeRef.current = recordSwipe;

  useEffect(() => {
    const start = currentIndex + 1;
    const end = Math.min(recipes.length, start + PREFETCH_AHEAD);
    for (let i = start; i < end; i += 1) {
      const url = getImageUrl(recipes[i].image_name);
      if (prefetchedUrlsRef.current.has(url)) continue;
      prefetchedUrlsRef.current.add(url);
      Image.prefetch(url).catch(() => {});
    }
  }, [currentIndex, recipes]);

  useEffect(() => {
    positionValueRef.current = 0;
    const listenerId = position.addListener(({ value }) => {
      positionValueRef.current = value;
    });
    return () => {
      position.removeListener(listenerId);
    };
  }, [position]);

  const cardStyle = useMemo(() => {
    const rotate = position.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-12deg', '0deg', '12deg'],
    });
    return {
      transform: [{ translateX: position }, { rotate }],
    };
  }, [position]);

  const likeOpacity = useMemo(
    () =>
      Animated.multiply(
        overlayOpacity,
        position.interpolate({
          inputRange: [0, SWIPE_THRESHOLD],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      ),
    [overlayOpacity, position]
  );

  const nopeOpacity = useMemo(
    () =>
      Animated.multiply(
        overlayOpacity,
        position.interpolate({
          inputRange: [-SWIPE_THRESHOLD, 0],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        })
      ),
    [overlayOpacity, position]
  );

  const swipeBackdropOpacity = overlayOpacity;

  const nextCardBlurOpacity = useMemo(
    () =>
      position.interpolate({
        inputRange: [-SWIPE_THRESHOLD * 4.2, 0, SWIPE_THRESHOLD * 5],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      }),
    [position]
  );

  const finishSwipe = useCallback(
    (direction: 'left' | 'right', shouldRecord = true) => {
      overlayOpacity.setValue(0);
      isAnimatingRef.current = false;
      if (!shouldRecord) return;
      const idx = currentIndexRef.current;
      const recipe = recipesRef.current[idx];
      if (recipe) {
        const liked = direction === 'right';
        void recordSwipeRef.current(recipe, liked);
      }
    },
    [overlayOpacity]
  );

  const finishReset = useCallback(() => {
    overlayOpacity.setValue(0);
    isAnimatingRef.current = false;
  }, [overlayOpacity]);

  const getCurrentDx = useCallback((fallbackDx = 0) => {
    const value = positionValueRef.current;
    if (Number.isFinite(value)) {
      return value;
    }
    if (Number.isFinite(fallbackDx)) {
      return fallbackDx;
    }
    return 0;
  }, []);

  const shouldSetPanResponder = useCallback((gesture) => {
    if (isAnimatingRef.current) return false;
    const dx = Number.isFinite(gesture.dx) ? gesture.dx : 0;
    const dy = Number.isFinite(gesture.dy) ? gesture.dy : 0;
    const vx = Number.isFinite(gesture.vx) ? gesture.vx : 0;
    const vy = Number.isFinite(gesture.vy) ? gesture.vy : 0;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const isHorizontalIntent = absDx >= absDy + SWIPE_DIRECTIONAL_OFFSET;
    const isSlightHorizontal =
      absDx > SWIPE_ACTIVATION_DISTANCE && absDx >= absDy && absDy < SWIPE_VERTICAL_SLOP;
    const isFastSwipe =
      Math.abs(vx) > SWIPE_ACTIVATION_VELOCITY && Math.abs(vx) >= Math.abs(vy);
    return (
      (isHorizontalIntent && absDx > SWIPE_ACTIVATION_DISTANCE) ||
      isSlightHorizontal ||
      isFastSwipe
    );
  }, []);

  const forceSwipe = useCallback(
    (direction: 'left' | 'right', releaseDx: number) => {
      isAnimatingRef.current = true;
      const baseX = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
      position.stopAnimation();
      const currentDx = getCurrentDx(releaseDx);
      const targetX = direction === 'right' ? Math.max(currentDx, baseX) : Math.min(currentDx, baseX);
      const remainingDistance = Math.abs(targetX - currentDx);
      if (remainingDistance < 1) {
        position.setValue(targetX);
        finishSwipe(direction);
        return;
      }
      const duration = Math.max(60, Math.min(220, (remainingDistance / SCREEN_WIDTH) * 200));
      Animated.timing(position, {
        toValue: targetX,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        finishSwipe(direction);
      });
    },
    [finishSwipe, getCurrentDx, position]
  );

  const resetPosition = useCallback(() => {
    isAnimatingRef.current = true;
    position.stopAnimation();
    const currentDx = getCurrentDx();
    if (Math.abs(currentDx) < 1) {
      position.setValue(0);
      finishReset();
      return;
    }
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
      friction: 5,
    }).start(() => {
      finishReset();
    });
  }, [finishReset, getCurrentDx, position]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onPanResponderGrant: () => {
          if (isAnimatingRef.current) return;
          position.stopAnimation();
          overlayOpacity.setValue(1);
        },
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => {
          return shouldSetPanResponder(gesture);
        },
        onMoveShouldSetPanResponderCapture: (_, gesture) => {
          return shouldSetPanResponder(gesture);
        },
        onPanResponderMove: (event, gesture) => {
          if (isAnimatingRef.current) return;
          panResponderMove(event, gesture);
        },
        onPanResponderRelease: (_, gesture) => {
          const releaseDx = Number.isFinite(gesture.dx) ? gesture.dx : 0;
          const releaseVx = Number.isFinite(gesture.vx) ? gesture.vx : 0;
          const releaseVy = Number.isFinite(gesture.vy) ? gesture.vy : 0;
          const isFastRelease =
            Math.abs(releaseVx) > SWIPE_RELEASE_VELOCITY &&
            Math.abs(releaseVx) >= Math.abs(releaseVy);
          if (releaseDx > SWIPE_THRESHOLD || (releaseDx > 0 && isFastRelease)) {
            forceSwipe('right', releaseDx);
          } else if (releaseDx < -SWIPE_THRESHOLD || (releaseDx < 0 && isFastRelease)) {
            forceSwipe('left', releaseDx);
          } else {
            resetPosition();
          }
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderTerminate: () => {
          overlayOpacity.setValue(0);
          resetPosition();
        },
      }),
    [forceSwipe, overlayOpacity, panResponderMove, position, resetPosition, shouldSetPanResponder]
  );

  const renderCards = () => {
    // Loading state
    if (isLoading) {
      return <LoadingAnimation message="Finding recipes for you..." />;
    }

    // Error state
    if (error) {
      return (
        <View style={styles.noMoreCards}>
          <Leaf size={80} color={Colors.dark.success} />
          <Text style={[styles.noMoreText, styles.errorTitle]}>Oops!</Text>
          <Text style={styles.noMoreSubtext}>{error}</Text>
          <PressableScale
            style={[styles.retryButton, styles.retryButtonError]}
            onPress={refreshFeed}
            pressRetentionOffset={PRESS_RETENTION_OFFSET}
            scaleTo={0.97}
            durationIn={50}
            durationOut={80}
          >
            <RefreshCw size={20} color={Colors.dark.textPrimary} />
            <Text style={styles.retryText}>Try Again</Text>
          </PressableScale>
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
          <Text style={styles.noMoreText}>No recipes match</Text>
          <Text style={styles.noMoreSubtext}>Try changing your filters</Text>
          <PressableScale
            style={styles.retryButton}
            onPress={() => navigation.navigate('Preferences')}
            pressRetentionOffset={PRESS_RETENTION_OFFSET}
            scaleTo={0.97}
            durationIn={50}
            durationOut={80}
          >
            <RefreshCw size={20} color={Colors.dark.textPrimary} />
            <Text style={styles.retryText}>Change Filters</Text>
          </PressableScale>
        </View>
      );
    }

    // Render recipe cards
    const visibleRecipes = recipes.slice(currentIndex, currentIndex + 3);
    return visibleRecipes
      .map((recipe, offset) => {
        const isActive = offset === 0;
        const isNext = offset === 1;
        const stackOffset = Math.max(0, offset - 1) * 10;
        return (
          <SwipeableCard
            key={recipe.id}
            recipe={recipe}
            isActive={isActive}
            stackOffset={stackOffset}
            panHandlers={isActive ? panResponder.panHandlers : undefined}
            cardStyle={isActive ? cardStyle : undefined}
            blurOpacity={isNext ? nextCardBlurOpacity : undefined}
            likeOpacity={isActive ? likeOpacity : undefined}
            nopeOpacity={isActive ? nopeOpacity : undefined}
          />
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#050704', '#0f1a0a', '#050704']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.swipeBackdrop, { opacity: swipeBackdropOpacity }]}
      />
      <View style={styles.cardsContainer}>
        <View style={styles.cardStage}>{renderCards()}</View>
      </View>
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
  cardStage: {
    width: CARD_MAX_WIDTH,
    height: CARD_MAX_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.dark.card,
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
  retryButtonError: {
    backgroundColor: Colors.dark.success,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
  },
  errorTitle: {
    color: Colors.dark.success,
  },
});
