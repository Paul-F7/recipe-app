import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import { ArrowRight, Coffee, CupSoda, Heart, IceCream, Sandwich, Trash2, Utensils } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { RootTabParamList } from './../components/tabnavigator';

import { Colors } from '../constants/theme';
import PressableScale from '../components/PressableScale';
import LikedRecipeSheetContent from '../components/LikedRecipeSheetContent';
import { useLikedRecipes } from '../context/LikedRecipesContext';
import { getImageUrl } from '../constants/images';
import { DishType, Recipe } from '../types';
import { isTablet, CONTENT_MAX_WIDTH } from '../constants/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LIST_HORIZONTAL_PADDING = 20;
const LIST_COLUMN_GAP = 20;
const NUM_COLUMNS = isTablet ? 3 : 2;
const LIST_CONTAINER_WIDTH = isTablet
  ? Math.min(SCREEN_WIDTH, 760)
  : SCREEN_WIDTH;
const CARD_WIDTH =
  (LIST_CONTAINER_WIDTH - LIST_HORIZONTAL_PADDING * 2 - LIST_COLUMN_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.05;
const SHEET_MAX_WIDTH = isTablet ? 640 : SCREEN_WIDTH;
const SHEET_BACKGROUND = '#111114';
const PRESS_RETENTION_OFFSET = { top: 6, bottom: 6, left: 6, right: 6 };
const REMOVE_HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };
const FILTER_SCROLL_MAX_HEIGHT = isTablet ? 54 : 34;
const FILTER_CHIP_ICON_SIZE = isTablet ? 20 : 14;
const FILTER_CHIP_PADDING_VERTICAL = isTablet ? 10 : 5;
const FILTER_CHIP_PADDING_HORIZONTAL = isTablet ? 16 : 10;
const FILTER_CHIP_RADIUS = isTablet ? 20 : 14;
const FILTER_CHIP_LABEL_SIZE = isTablet ? 16 : 12;

const MEAL_COLORS: Record<DishType, string> = {
  breakfast: '#fbbf24',
  lunch: '#60a5fa',
  dinner: '#34d399',
  dessert: '#f472b6',
  drink: '#a78bfa',
};
const MEAL_ICONS: Record<DishType, typeof Utensils> = {
  breakfast: Coffee,
  lunch: Sandwich,
  dinner: Utensils,
  dessert: IceCream,
  drink: CupSoda,
};

const formatMealLabel = (mealType?: string) => {
  if (!mealType) return 'Meal';
  return mealType
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const MEAL_OPTIONS: { id: DishType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'drink', label: 'Drinks' },
];

export default function LikedScreen() {
  const { likedRecipes, removeLikedRecipe, isLoading } = useLikedRecipes();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [selectedMeals, setSelectedMeals] = useState<Set<DishType>>(
    new Set<DishType>(['breakfast', 'lunch', 'dinner', 'dessert', 'drink'])
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const filteredRecipes =
    selectedMeals.size === 0
      ? likedRecipes
      : likedRecipes.filter((recipe) =>
          recipe.dish_type?.some((meal) => selectedMeals.has(meal))
        );
  const hasFilteredRecipes = filteredRecipes.length > 0;
  const showListFades = hasFilteredRecipes;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#050704', '#0f1a0a', '#050704']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (likedRecipes.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#050704', '#0f1a0a', '#050704']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.emptyState}>
          <Heart size={80} color={Colors.dark.textSecondary} />
          <Text style={styles.emptyTitle}>No liked recipes yet</Text>
          <Text style={styles.emptySubtext}>
            Browse recipes, then swipe right to save your favorites here
          </Text>
          <PressableScale
            style={styles.startSwipingButton}
            onPress={() => navigation.navigate('Discovery')}
            accessibilityRole="button"
            accessibilityLabel="Start swiping recipes"
            accessibilityHint="Opens recipe discovery so you can find recipes to like"
            pressRetentionOffset={PRESS_RETENTION_OFFSET}
            scaleTo={0.97}
            durationIn={50}
            durationOut={80}
          >
            <LinearGradient
              colors={['rgba(52, 199, 89, 0.18)', 'rgba(52, 199, 89, 0.04)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.startSwipingButtonText}>Start swiping recipes</Text>
            <ArrowRight size={18} color={Colors.dark.success} strokeWidth={2.5} />
          </PressableScale>
        </View>
      </View>
    );
  }

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const primaryMeal = item.dish_type?.[0] as DishType | undefined;
    const mealLabel = formatMealLabel(primaryMeal);
    const mealColor = primaryMeal ? MEAL_COLORS[primaryMeal] : Colors.dark.textSecondary;
    const MealIcon = primaryMeal ? MEAL_ICONS[primaryMeal] : Utensils;

    return (
      <PressableScale
        style={styles.card}
        onPress={() => openRecipeModal(item)}
        pressRetentionOffset={PRESS_RETENTION_OFFSET}
        scaleTo={0.98}
        durationIn={50}
        durationOut={80}
      >
        <View style={styles.cardImageWrapper}>
          <Image
            source={{ uri: getImageUrl(item.image_name) }}
            style={styles.cardImage}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={styles.cardImageGradient}
          />
          <View style={styles.mealTagOverlay}>
            <View
              style={[
                styles.mealTag,
                { borderColor: mealColor },
              ]}
            >
              <View style={styles.mealTagIcon}>
                <MealIcon size={12} color={mealColor} />
              </View>
              <Text style={styles.mealTagText}>{mealLabel}</Text>
            </View>
          </View>
          <View style={styles.cardTitleOverlay}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>
        <PressableScale
          style={styles.removeButton}
          onPress={(event) => {
            event.stopPropagation();
            removeLikedRecipe(item.id);
          }}
          hitSlop={REMOVE_HIT_SLOP}
          pressRetentionOffset={PRESS_RETENTION_OFFSET}
          scaleTo={0.9}
          durationIn={45}
          durationOut={70}
        >
          <Trash2 size={18} color={Colors.dark.textPrimary} />
        </PressableScale>
      </PressableScale>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#050704', '#0f1a0a', '#050704']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Heart size={28} color={Colors.dark.accent} />
          <View style={styles.headerTitleGroup}>
            <Text style={[styles.headerTitle, styles.headerTitleLiked]}>Liked</Text>
            <Text style={styles.headerTitle}>Recipes</Text>
          </View>
        </View>
        <Text style={styles.headerCount}>{filteredRecipes.length} recipes</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
        style={styles.filterScroll}
      >
        {MEAL_OPTIONS.map((option) => {
          const isActive = selectedMeals.has(option.id);
          const MealIcon = MEAL_ICONS[option.id];
          const mealColor = MEAL_COLORS[option.id];
          return (
            <PressableScale
              key={option.id}
              style={[
                styles.filterChip,
                isActive && {
                  backgroundColor: `${mealColor}12`,
                  borderColor: `${mealColor}40`,
                },
              ]}
              onPress={() =>
                setSelectedMeals((prev) => {
                  const next = new Set(prev);
                  if (next.has(option.id)) {
                    if (next.size === 1) return prev;
                    next.delete(option.id);
                  } else {
                    next.add(option.id);
                  }
                  return next;
                })
              }
              pressRetentionOffset={PRESS_RETENTION_OFFSET}
              scaleTo={0.96}
              durationIn={45}
              durationOut={70}
            >
              <MealIcon
                size={FILTER_CHIP_ICON_SIZE}
                color={isActive ? `${mealColor}90` : 'rgba(142, 142, 147, 0.6)'}
              />
              <Text
                style={[
                  styles.filterChipLabel,
                  isActive && { color: `${mealColor}B0` },
                ]}
              >
                {option.label}
              </Text>
            </PressableScale>
          );
        })}
      </ScrollView>
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          ListEmptyComponent={
            <View style={styles.emptyFilterState}>
              <View style={styles.emptyFilterIcon}>
                <Utensils size={22} color={Colors.dark.textSecondary} />
              </View>
              <Text style={styles.emptyFilterTitle}>0 recipes match your filters</Text>
              <Text style={styles.emptyFilterText}>
                Try selecting more meal types to see additional liked recipes.
              </Text>
            </View>
          }
          contentContainerStyle={[styles.list, !hasFilteredRecipes && styles.listEmpty]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
        {showListFades && (
          <>
            <LinearGradient
              colors={['#000000', 'rgba(0,0,0,0)']}
              style={styles.listFadeTop}
              pointerEvents="none"
            />
            <View style={styles.listBlackBottom} pointerEvents="none" />
            <LinearGradient
              colors={['rgba(0,0,0,0)', '#000000']}
              style={styles.listFadeBottom}
              pointerEvents="none"
            />
          </>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={selectedRecipe !== null}
        onRequestClose={closeRecipeModal}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeRecipeModal} />
          <View style={styles.modalSheet}>
            <LikedRecipeSheetContent recipe={selectedRecipe} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
  },
  headerTitleLiked: {
    color: Colors.dark.accent,
  },
  headerCount: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  list: {
    paddingHorizontal: LIST_HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 100,
    width: LIST_CONTAINER_WIDTH,
    alignSelf: 'center',
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  listFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  listBlackBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  listFadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
    height: 150,
    zIndex: 5,
  },
  filterScroll: {
    maxHeight: FILTER_SCROLL_MAX_HEIGHT,
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isTablet ? 8 : 5,
    paddingVertical: FILTER_CHIP_PADDING_VERTICAL,
    paddingHorizontal: FILTER_CHIP_PADDING_HORIZONTAL,
    borderRadius: FILTER_CHIP_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  filterChipLabel: {
    fontSize: FILTER_CHIP_LABEL_SIZE,
    fontWeight: isTablet ? '600' : '500',
    color: 'rgba(142, 142, 147, 0.7)',
  },
  row: {
    justifyContent: 'flex-start',
    gap: LIST_COLUMN_GAP,
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardImageWrapper: {
    position: 'relative',
    height: CARD_HEIGHT,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
    lineHeight: 24,
  },
  cardTitleOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
  },
  mealTagOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  mealTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealTagIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  mealTagText: {
    color: Colors.dark.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: isTablet ? 'center' : 'flex-end',
    alignItems: 'center',
  },
  modalSheet: {
    width: '100%',
    maxWidth: SHEET_MAX_WIDTH,
    height: isTablet ? '78%' : '82%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: isTablet ? 28 : 0,
    borderBottomRightRadius: isTablet ? 28 : 0,
    backgroundColor: SHEET_BACKGROUND,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
    overflow: 'hidden',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginTop: 20,
  },
  emptyFilterState: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyFilterIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyFilterTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  emptyFilterText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  startSwipingButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 66,
    minWidth: isTablet ? 320 : 286,
    paddingVertical: 19,
    paddingHorizontal: 28,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#0c0f0c',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: Colors.dark.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  startSwipingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
  },
});
