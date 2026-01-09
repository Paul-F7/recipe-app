import React from 'react';
import { StyleSheet, Animated, Dimensions, View } from 'react-native';
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
          <View style={styles.likeIconGlow}>
            <Heart size={120} color="#eaffff" fill="#eaffff" />
          </View>
        </Animated.View>
        {/* Dislike overlay - red tint with X */}
        <Animated.View
          style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}
          pointerEvents="none"
        >
          <View style={styles.nopeIconGlow}>
            <X size={120} color="#ffe9f1" strokeWidth={3} />
          </View>
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
    backgroundColor: 'rgba(0, 255, 198, 0.22)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(255, 59, 140, 0.22)',
  },
  likeIconGlow: {
    shadowColor: '#00ffd0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 12,
  },
  nopeIconGlow: {
    shadowColor: '#ff3d71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 12,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
});
