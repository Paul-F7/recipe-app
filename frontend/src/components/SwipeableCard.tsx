import React from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import { Heart, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SwipeableCardProps {
  recipe: Recipe;
  isActive: boolean;
  stackOffset?: number;
  panHandlers?: any;
  cardStyle?: any;
  likeOpacity?: Animated.AnimatedInterpolation<number>;
  nopeOpacity?: Animated.AnimatedInterpolation<number>;
  blurOpacity?: Animated.AnimatedInterpolation<number>;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function SwipeableCard({
  recipe,
  isActive,
  stackOffset = 0,
  panHandlers,
  cardStyle,
  likeOpacity,
  nopeOpacity,
  blurOpacity,
}: SwipeableCardProps) {
  if (isActive) {
    return (
      <Animated.View style={[styles.cardContainer, cardStyle]} {...panHandlers}>
        <RecipeCard recipe={recipe} />
        {/* Like overlay - green tint with heart */}
        <Animated.View
          style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}
          pointerEvents="none"
        >
          <Heart size={120} color="#fff" fill="#fff" />
        </Animated.View>
        {/* Dislike overlay - red tint with X */}
        <Animated.View
          style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}
          pointerEvents="none"
        >
          <X size={120} color="#fff" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cardContainer, { top: stackOffset }, cardStyle]}>
      <RecipeCard recipe={recipe} />
      {blurOpacity !== undefined ? (
        <AnimatedBlurView
          intensity={80}
          tint="dark"
          style={[styles.blurOverlay, { opacity: blurOpacity }]}
          pointerEvents="none"
        />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 34,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  likeOverlay: {
    backgroundColor: 'rgba(34, 197, 94, 0.6)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.6)',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
});
