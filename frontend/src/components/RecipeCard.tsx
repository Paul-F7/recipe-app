import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { Colors } from '../constants/theme';
import { Recipe } from '../types';
import { getImageUrl } from '../constants/images';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: getImageUrl(recipe.image_name) }} style={styles.cardImage} />
        <LinearGradient
          colors={['rgba(28,28,30,0)', Colors.dark.card]}
          style={styles.imageGradient}
        />
        <LinearGradient
          colors={['rgba(28,28,30,0)', 'rgba(28,28,30,0.7)', Colors.dark.card]}
          style={styles.imageEdge}
          pointerEvents="none"
        />
        <View style={styles.imageEdgeLine} pointerEvents="none" />
      </View>

      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{recipe.title}</Text>
        <View style={styles.tags}>
          {recipe.diets.map((diet) => (
            <View key={diet} style={styles.tag}>
              <Text style={styles.tagText}>{diet}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.cardContent}
        contentContainerStyle={styles.cardContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, idx) => (
            <View key={idx} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.listText}>{recipe.instructions}</Text>
        </View>
      </ScrollView>
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

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 34,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 280,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageGradient: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    height: 100,
  },
  imageEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
  },
  imageEdgeLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  cardHeader: {
    position: 'absolute',
    top: 220,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
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
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: Colors.dark.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 59,
    paddingBottom: 22,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.accent,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: 15,
    lineHeight: 22,
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
