import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Coffee,
  CupSoda,
  Flame,
  IceCream,
  Leaf,
  ListOrdered,
  MilkOff,
  Sandwich,
  Utensils,
  WheatOff,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/theme';
import { DishType, DietType, Recipe } from '../types';

type Props = {
  recipe: Recipe | null;
};

const formatMealLabel = (mealType?: string) => {
  if (!mealType) return 'Meal';
  return mealType
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

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

const DIET_COLORS: Record<DietType, string> = {
  Vegetarian: '#22c55e',
  'Gluten Free': '#f97316',
  Keto: '#38bdf8',
  'Lactose-Free': '#f59e0b',
};
const DIET_ICONS: Record<DietType, typeof Utensils> = {
  Vegetarian: Leaf,
  'Gluten Free': WheatOff,
  Keto: Flame,
  'Lactose-Free': MilkOff,
};
const INGREDIENTS_ACCENT = '#22c55e';
const INSTRUCTIONS_ACCENT = '#f59e0b';
const SHEET_BACKGROUND = '#111114';

const hexToRgba = (hex: string, alpha: number) => {
  const trimmed = hex.replace('#', '');
  if (trimmed.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  const value = parseInt(trimmed, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export default function LikedRecipeSheetContent({ recipe }: Props) {
  if (!recipe) {
    return <View style={styles.container} />;
  }

  const primaryMeal = recipe.dish_type?.[0];
  const ingredients = recipe.ingredients ?? [];
  const instructionSteps = recipe.instructions
    .split(/\n+/)
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => step.replace(/^\s*\d+[\).\s-]+/, '').trim());
  const tags = [
    ...(primaryMeal
      ? [
          {
            label: formatMealLabel(primaryMeal),
            color: MEAL_COLORS[primaryMeal],
            Icon: MEAL_ICONS[primaryMeal],
          },
        ]
      : []),
    ...(recipe.diets ?? []).map((diet) => ({
      label: diet,
      color: DIET_COLORS[diet],
      Icon: DIET_ICONS[diet],
    })),
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        accessibilityLabel={recipe.title}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <View
              key={tag.label}
              style={[
                styles.tag,
                {
                  borderColor: tag.color,
                  backgroundColor: hexToRgba(tag.color, 0.16),
                },
              ]}
            >
              <View style={styles.tagContent}>
                <tag.Icon size={12} color={tag.color} />
                <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: hexToRgba(INGREDIENTS_ACCENT, 0.2) },
            ]}
          >
            <Leaf size={16} color={INGREDIENTS_ACCENT} />
          </View>
          <Text style={styles.sectionLabel}>Ingredients</Text>
        </View>
        <View style={styles.ingredientsBubbles}>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <View key={`${ingredient}-${index}`} style={styles.ingredientBubble}>
                <Text style={styles.ingredientBubbleText}>{ingredient}</Text>
              </View>
            ))
          ) : (
            <View style={styles.ingredientBubble}>
              <Text style={styles.ingredientBubbleText}>No ingredients listed</Text>
            </View>
          )}
        </View>
        <View style={styles.sectionHeader}>
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: hexToRgba(INSTRUCTIONS_ACCENT, 0.2) },
            ]}
          >
            <ListOrdered size={16} color={INSTRUCTIONS_ACCENT} />
          </View>
          <Text style={styles.sectionLabel}>Instructions</Text>
        </View>
        <View style={styles.instructionsList}>
          {instructionSteps.length > 0 ? (
            instructionSteps.map((step, index) => (
              <View key={`step-${index}`} style={styles.instructionItem}>
                <View style={styles.instructionIndex}>
                  <Text style={styles.instructionIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.instructionText}>No instructions listed</Text>
          )}
        </View>
      </ScrollView>
      <LinearGradient
        colors={[SHEET_BACKGROUND, 'rgba(28, 28, 30, 0)']}
        style={styles.fadeTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(28, 28, 30, 0)', SHEET_BACKGROUND]}
        style={styles.fadeBottom}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 30,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.dark.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 36,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
  },
  ingredientsBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  ingredientBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: hexToRgba(INGREDIENTS_ACCENT, 0.35),
    backgroundColor: hexToRgba(INGREDIENTS_ACCENT, 0.08),
  },
  ingredientBubbleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
  },
  instructionsList: {
    gap: 16,
    paddingBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  instructionIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexToRgba(INSTRUCTIONS_ACCENT, 0.2),
  },
  instructionIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: INSTRUCTIONS_ACCENT,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.dark.textPrimary,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  fadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
});
