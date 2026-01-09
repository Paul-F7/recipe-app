import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '../components/RecipeCard';
import ActionButtons from '../components/ActionButtons';
import { mockRecipes } from '../data/mockRecipes';
import { COLORS, SPACING, FONTS, SHADOWS } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DiscoverScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [likedRecipes, setLikedRecipes] = useState([]);

  const handleSwipeRight = useCallback((recipe) => {
    setLikedRecipes((prev) => [...prev, recipe]);
    setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
  }, []);

  const handleSwipeLeft = useCallback((recipe) => {
    setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
  }, []);

  const handleLike = () => {
    if (recipes.length > 0) {
      handleSwipeRight(recipes[0]);
    }
  };

  const handleDislike = () => {
    if (recipes.length > 0) {
      handleSwipeLeft(recipes[0]);
    }
  };

  const handleSuperLike = () => {
    if (recipes.length > 0) {
      const recipe = recipes[0];
      setLikedRecipes((prev) => [{ ...recipe, superLiked: true }, ...prev]);
      setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.background, '#0A0A0C']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[COLORS.primary, '#FF8585']}
            style={styles.logoGradient}
          >
            <Ionicons name="restaurant" size={20} color={COLORS.textPrimary} />
          </LinearGradient>
          <Text style={styles.logoText}>Swipe & Dine</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={COLORS.accent} />
            <Text style={styles.streakText}>{likedRecipes.length}</Text>
          </View>
        </View>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {recipes.length > 0 ? (
          recipes
            .slice(0, 3)
            .reverse()
            .map((recipe, index) => {
              const isFirst = index === recipes.slice(0, 3).length - 1;
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFirst={isFirst}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              );
            })
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="restaurant-outline" size={60} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No More Recipes</Text>
            <Text style={styles.emptySubtitle}>
              You've seen all the recipes! Check back later for more delicious discoveries.
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {recipes.length > 0 && (
        <View style={styles.actionsContainer}>
          <ActionButtons
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperLike={handleSuperLike}
          />
        </View>
      )}

      {/* Bottom spacer for tab bar */}
      <View style={styles.bottomSpacer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  logoText: {
    fontSize: 22,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: 4,
    ...SHADOWS.sm,
  },
  streakText: {
    color: COLORS.accent,
    fontSize: 14,
    ...FONTS.bold,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  actionsContainer: {
    paddingBottom: SPACING.sm,
  },
  bottomSpacer: {
    height: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  emptyTitle: {
    fontSize: 24,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DiscoverScreen;