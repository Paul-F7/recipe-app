import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const HORIZONTAL_SWIPE_THRESHOLD = 10; // Minimum horizontal movement to trigger swipe

const RecipeCard = ({ recipe, onSwipeLeft, onSwipeRight, isFirst }) => {
  const position = useRef(new Animated.Value(0)).current;
  const isSwipingRef = useRef(false);

  const rotate = position.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only capture horizontal swipes, let vertical pass through for scroll
        const isHorizontalSwipe = Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
                                   Math.abs(gesture.dx) > HORIZONTAL_SWIPE_THRESHOLD;
        return isHorizontalSwipe;
      },
      onPanResponderGrant: () => {
        isSwipingRef.current = true;
      },
      onPanResponderMove: (_, gesture) => {
        // Only move horizontally - no vertical movement
        position.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        isSwipingRef.current = false;

        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right - like
          Animated.timing(position, {
            toValue: SCREEN_WIDTH + 100,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onSwipeRight && onSwipeRight(recipe);
            position.setValue(0);
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left - dislike
          Animated.timing(position, {
            toValue: -SCREEN_WIDTH - 100,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            onSwipeLeft && onSwipeLeft(recipe);
            position.setValue(0);
          });
        } else {
          // Snap back to center
          Animated.spring(position, {
            toValue: 0,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        isSwipingRef.current = false;
        Animated.spring(position, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const animatedStyle = isFirst
    ? {
        transform: [
          { translateX: position },
          { rotate },
        ],
      }
    : {};

  return (
    <Animated.View
      style={[styles.cardContainer, animatedStyle]}
      {...(isFirst ? panResponder.panHandlers : {})}
    >
      {/* Like/Dislike Indicators */}
      {isFirst && (
        <>
          <Animated.View style={[styles.likeIndicator, { opacity: likeOpacity }]}>
            <View style={styles.indicatorBadge}>
              <Ionicons name="heart" size={40} color={COLORS.like} />
              <Text style={styles.indicatorText}>LIKE</Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.dislikeIndicator, { opacity: dislikeOpacity }]}>
            <View style={styles.indicatorBadge}>
              <Ionicons name="close" size={40} color={COLORS.dislike} />
              <Text style={[styles.indicatorText, { color: COLORS.dislike }]}>NOPE</Text>
            </View>
          </Animated.View>
        </>
      )}

      <View style={styles.card}>
        {/* Recipe Image */}
        <Image source={{ uri: recipe.image }} style={styles.image} />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={COLORS.cardGradient}
          style={styles.gradient}
          locations={[0, 0.5, 1]}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{recipe.time}</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{recipe.calories} cal</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{recipe.servings}</Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              <View style={[styles.tag, styles.difficultyTag]}>
                <Text style={styles.tagText}>{recipe.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Scrollable Details */}
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {/* Ingredients */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="basket-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            {/* Instructions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list-outline" size={20} color={COLORS.secondary} />
                <Text style={styles.sectionTitle}>Instructions</Text>
              </View>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...SHADOWS.lg,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '45%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingTop: '35%',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: 26,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
    ...FONTS.medium,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  difficultyTag: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    ...FONTS.medium,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    ...FONTS.semibold,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 7,
    marginRight: SPACING.sm,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  stepNumberText: {
    fontSize: 12,
    color: COLORS.secondary,
    ...FONTS.bold,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
  likeIndicator: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  dislikeIndicator: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  indicatorBadge: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 3,
    borderColor: COLORS.like,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  indicatorText: {
    fontSize: 16,
    color: COLORS.like,
    ...FONTS.bold,
    marginTop: 2,
  },
});

export default RecipeCard;
