import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LikedRecipeCard from '../components/LikedRecipeCard';
import { mockRecipes } from '../data/mockRecipes';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const LikedScreen = () => {
  // Start with some liked recipes for demo
  const [likedRecipes, setLikedRecipes] = useState(mockRecipes.slice(0, 4));
  const [filter, setFilter] = useState('all');

  const handleRemove = (id) => {
    setLikedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const filters = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: 'quick', label: 'Quick', icon: 'flash-outline' },
    { key: 'starred', label: 'Starred', icon: 'star-outline' },
  ];

  const filteredRecipes = likedRecipes.filter((recipe) => {
    if (filter === 'quick') {
      return parseInt(recipe.time) <= 30;
    }
    if (filter === 'starred') {
      return recipe.superLiked;
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[COLORS.background, '#0A0A0C']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Recipes</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{likedRecipes.length}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filterTab, filter === item.key && styles.filterTabActive]}
            onPress={() => setFilter(item.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={filter === item.key ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.filterTabText,
                filter === item.key && styles.filterTabTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recipe Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecipes.length > 0 ? (
          <View style={styles.grid}>
            {filteredRecipes.map((recipe) => (
              <LikedRecipeCard
                key={recipe.id}
                recipe={recipe}
                onRemove={handleRemove}
                onPress={() => {}}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="heart-outline" size={50} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Saved Recipes</Text>
            <Text style={styles.emptySubtitle}>
              Start swiping right on recipes you love to save them here!
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: 26,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  headerBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  headerBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    ...FONTS.bold,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  filterTabActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    ...FONTS.medium,
  },
  filterTabTextActive: {
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  emptyTitle: {
    fontSize: 20,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 120,
  },
});

export default LikedScreen;