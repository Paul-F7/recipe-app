import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Circle, Flame, Leaf, ListOrdered, MilkOff, WheatOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { Colors } from '../constants/theme';
import { Recipe } from '../types';
import { getImageUrl } from '../constants/images';

interface RecipeCardProps {
  recipe: Recipe;
}

const DIET_TAGS = {
  Vegetarian: {
    label: 'Vegetarian',
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderColor: 'rgba(34, 197, 94, 0.55)',
    textColor: '#bbf7d0',
    icon: Leaf,
    iconColor: '#4ade80',
    iconBackground: 'rgba(34, 197, 94, 0.35)',
  },
  'Gluten Free': {
    label: 'Gluten Free',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderColor: 'rgba(245, 158, 11, 0.55)',
    textColor: '#fde68a',
    icon: WheatOff,
    iconColor: '#fbbf24',
    iconBackground: 'rgba(245, 158, 11, 0.35)',
  },
  Keto: {
    label: 'Keto',
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: 'rgba(59, 130, 246, 0.55)',
    textColor: '#bfdbfe',
    icon: Flame,
    iconColor: '#60a5fa',
    iconBackground: 'rgba(59, 130, 246, 0.35)',
  },
  'Lactose-Free': {
    label: 'Lactose-Free',
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
    borderColor: 'rgba(168, 85, 247, 0.55)',
    textColor: '#e9d5ff',
    icon: MilkOff,
    iconColor: '#c084fc',
    iconBackground: 'rgba(168, 85, 247, 0.35)',
  },
} as const;

const FALLBACK_TAG = {
  backgroundColor: 'rgba(148, 163, 184, 0.18)',
  borderColor: 'rgba(148, 163, 184, 0.45)',
  textColor: '#e2e8f0',
  icon: Circle,
  iconColor: '#cbd5f5',
  iconBackground: 'rgba(148, 163, 184, 0.35)',
};

const getDietTagConfig = (diet: string) => {
  const tag = DIET_TAGS[diet as keyof typeof DIET_TAGS];
  if (tag) {
    return tag;
  }

  return {
    label: diet,
    ...FALLBACK_TAG,
  };
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const ingredientsList = recipe.ingredients
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
  const instructionSteps = recipe.instructions
    .split(/\n+/)
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => step.replace(/^\s*\d+[\).\s-]+/, '').trim());

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: getImageUrl(recipe.image_name) }} style={styles.cardImage} />
        <LinearGradient
          colors={[
            'rgba(12,12,14,0)',
            'rgba(12,12,14,0.02)',
            'rgba(12,12,14,0.06)',
            'rgba(12,12,14,0.12)',
            'rgba(12,12,14,0.22)',
            'rgba(12,12,14,0.35)',
            'rgba(12,12,14,0.5)',
            'rgba(12,12,14,0.68)',
            'rgba(12,12,14,0.82)',
            'rgba(12,12,14,0.92)',
            Colors.dark.card,
          ]}
          locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.84, 0.94, 1]}
          style={styles.imageGradient}
        />
      </View>

      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{recipe.title}</Text>
        <View style={styles.tags}>
          {recipe.diets.map((diet) => {
            const tag = getDietTagConfig(diet);
            const Icon = tag.icon;

            return (
              <View
                key={diet}
                style={[
                  styles.tag,
                  { backgroundColor: tag.backgroundColor, borderColor: tag.borderColor },
                ]}
              >
                <View style={[styles.tagIcon, { backgroundColor: tag.iconBackground }]}>
                  <Icon size={10} color={tag.iconColor} />
                </View>
                <Text style={[styles.tagText, { color: tag.textColor }]}>{tag.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.cardContentWrapper}>
        <ScrollView
          style={styles.cardContent}
          contentContainerStyle={styles.cardContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {ingredientsList.length > 0 && (
            <View style={[styles.section, styles.ingredientsSection]}>
              <View style={styles.ingredientsTitleRow}>
                <View style={styles.ingredientsTitleIcon}>
                  <Leaf size={14} color={INGREDIENTS_ACCENT} />
                </View>
                <Text style={styles.ingredientsTitle}>Ingredients</Text>
              </View>
              <View style={styles.ingredientsList}>
                {ingredientsList.map((ingredient, idx) => (
                  <View key={idx} style={styles.ingredientItem}>
                    <View style={styles.ingredientMarker} />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {instructionSteps.length > 0 && (
            <View style={styles.section}>
              <View style={styles.instructionsTitleRow}>
                <View style={styles.instructionsTitleIcon}>
                  <ListOrdered size={14} color={INSTRUCTIONS_ACCENT} />
                </View>
                <Text style={styles.instructionsTitle}>Instructions</Text>
              </View>
              <View style={styles.instructionsList}>
                {instructionSteps.map((instruction, index) => (
                  <View key={`step-${index}`} style={styles.instructionItem}>
                    <View style={styles.instructionIndex}>
                      <Text style={styles.instructionIndexText}>{index + 1}</Text>
                    </View>
                    <View style={styles.instructionBody}>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        <BlurView
          intensity={10}
          tint="dark"
          style={styles.contentTopBlur}
          pointerEvents="none"
        />
        <BlurView
          intensity={6}
          tint="dark"
          style={styles.contentTopBlurFeather}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[
            Colors.dark.card,
            'rgba(12,12,14,0.85)',
            'rgba(12,12,14,0.5)',
            'rgba(12,12,14,0.2)',
            'rgba(12,12,14,0)',
          ]}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          style={styles.contentTopFade}
          pointerEvents="none"
        />
      </View>
      <BlurView
        intensity={12}
        tint="dark"
        style={styles.bottomNavBlurFeather}
        pointerEvents="none"
      />
      <BlurView
        intensity={18}
        tint="dark"
        style={styles.bottomNavBlurSoft}
        pointerEvents="none"
      />
      <BlurView
        intensity={32}
        tint="dark"
        style={styles.bottomNavBlurMid}
        pointerEvents="none"
      />
      <BlurView
        intensity={48}
        tint="dark"
        style={styles.bottomNavBlurStrong}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.25)',
          'rgba(0,0,0,0.6)',
          'rgba(0,0,0,0.9)',
          Colors.dark.background,
        ]}
        locations={[0, 0.3, 0.6, 0.85, 1]}
        style={styles.bottomNavFade}
        pointerEvents="none"
      />
    </View>
  );
}

const CARD_IMAGE_HEIGHT = 280;
const HEADER_TOP_OFFSET = 220;
const HEADER_OVERLAP = CARD_IMAGE_HEIGHT - HEADER_TOP_OFFSET;
const CONTENT_TOP_PADDING = 14;
const CONTENT_TOP_BLUR_HEIGHT = 12;
const CONTENT_TOP_BLUR_FEATHER_HEIGHT = 10;
const CONTENT_TOP_BLUR_FEATHER_OFFSET = 4;
const CONTENT_TOP_FADE_HEIGHT = 28;
const INGREDIENTS_ACCENT = '#22c55e';
const INSTRUCTIONS_ACCENT = '#f59e0b';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 34,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
  },
  cardHeader: {
    marginTop: -HEADER_OVERLAP,
    paddingHorizontal: 24,
    paddingBottom: 8,
    zIndex: 10,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 11,
    borderWidth: 1,
  },
  tagIcon: {
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: 22,
  },
  cardContentWrapper: {
    flex: 1,
  },
  contentTopBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CONTENT_TOP_BLUR_HEIGHT,
    zIndex: 2,
  },
  contentTopBlurFeather: {
    position: 'absolute',
    top: CONTENT_TOP_BLUR_HEIGHT - CONTENT_TOP_BLUR_FEATHER_OFFSET,
    left: 0,
    right: 0,
    height: CONTENT_TOP_BLUR_FEATHER_HEIGHT,
    opacity: 0.35,
    zIndex: 1,
  },
  contentTopFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CONTENT_TOP_FADE_HEIGHT,
    zIndex: 3,
  },
  cardContentContainer: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 12,
  },
  ingredientsSection: {
    backgroundColor: Colors.dark.cardLight,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  ingredientsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    letterSpacing: 0.2,
  },
  ingredientsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  ingredientsTitleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  instructionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  instructionsTitleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
  },
  ingredientMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: INGREDIENTS_ACCENT,
  },
  ingredientText: {
    flex: 1,
    color: Colors.dark.textPrimary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  instructionIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.55)',
  },
  instructionIndexText: {
    color: INSTRUCTIONS_ACCENT,
    fontSize: 12,
    fontWeight: '700',
  },
  instructionBody: {
    flex: 1,
    paddingTop: 2,
  },
  instructionText: {
    color: Colors.dark.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  bottomNavBlurSoft: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    opacity: 0.28,
    zIndex: 18,
  },
  bottomNavBlurFeather: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    height: 50,
    opacity: 0.2,
    zIndex: 17,
  },
  bottomNavBlurMid: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 125,
    opacity: 0.45,
    zIndex: 19,
  },
  bottomNavBlurStrong: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 95,
    opacity: 0.72,
    zIndex: 20,
  },
  bottomNavFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    zIndex: 21,
  },
});
