import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Heart, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/theme';
import { useLikedRecipes } from '../context/LikedRecipesContext';
import { mockRecipes } from '../mocks/recipes';
import { getImageUrl } from '../constants/images';
import { Recipe } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function LikedScreen() {
  const { likedRecipeIds, removeLikedRecipe, isLoading } = useLikedRecipes();

  const likedRecipes = mockRecipes.filter((recipe) =>
    likedRecipeIds.includes(recipe.id)
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0a0a0a', '#1a0a0a', '#0a0a0a']}
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
          colors={['#0a0a0a', '#1a0a0a', '#0a0a0a']}
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

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: getImageUrl(item.image_name) }}
        style={styles.cardImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cardGradient}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardTags}>
          {item.diets.slice(0, 2).map((diet) => (
            <View key={diet} style={styles.tag}>
              <Text style={styles.tagText}>{diet}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeLikedRecipe(item.id)}
      >
        <Trash2 size={18} color={Colors.dark.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a0a0a', '#0a0a0a']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Liked Recipes</Text>
        <Text style={styles.headerCount}>{likedRecipes.length} recipes</Text>
      </View>
      <FlatList
        data={likedRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
  },
  headerCount: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textPrimary,
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    color: Colors.dark.textPrimary,
    fontSize: 10,
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
