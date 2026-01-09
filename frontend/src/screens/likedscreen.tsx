import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Coffee, CupSoda, Heart, IceCream, Sandwich, Trash2, Utensils } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/theme';
import LikedRecipeSheetContent from '../components/LikedRecipeSheetContent';
import { useLikedRecipes } from '../context/LikedRecipesContext';
import { getImageUrl } from '../constants/images';
import { DishType, Recipe } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LIST_HORIZONTAL_PADDING = 20;
const LIST_COLUMN_GAP = 20;
const CARD_WIDTH = (SCREEN_WIDTH - LIST_HORIZONTAL_PADDING * 2 - LIST_COLUMN_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.05;
const SHEET_BACKGROUND = '#111114';

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
            Swipe right on recipes you love to save them here
          </Text>
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
      <Pressable style={styles.card} onPress={() => openRecipeModal(item)}>
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
        <Pressable
          style={styles.removeButton}
          onPress={(event) => {
            event.stopPropagation();
            removeLikedRecipe(item.id);
          }}
        >
          <Trash2 size={18} color={Colors.dark.textPrimary} />
        </Pressable>
      </Pressable>
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
            <TouchableOpacity
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
              activeOpacity={0.7}
            >
              <MealIcon size={14} color={isActive ? `${mealColor}90` : 'rgba(142, 142, 147, 0.6)'} />
              <Text
                style={[
                  styles.filterChipLabel,
                  isActive && { color: `${mealColor}B0` },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
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
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
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
    maxHeight: 34,
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  filterChipLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(142, 142, 147, 0.7)',
  },
  row: {
    justifyContent: 'space-between',
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
    justifyContent: 'flex-end',
  },
  modalSheet: {
    width: '100%',
    height: '82%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
  emptySubtext: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
  },
});
