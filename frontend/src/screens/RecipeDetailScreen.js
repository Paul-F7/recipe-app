import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;

  const renderTasteBar = (label, value) => (
    <View style={styles.tasteRow}>
      <Text style={styles.tasteLabel}>{label}</Text>
      <View style={styles.tasteBarContainer}>
        <View style={[styles.tasteBarFill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.tasteValue}>{Math.round(value)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: recipe.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.metaContainer}>
          {recipe.cook_time_minutes && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🕐</Text>
              <Text style={styles.metaText}>{recipe.cook_time_minutes} min</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🍽️</Text>
            <Text style={styles.metaText}>{recipe.dish_type.join(', ')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taste Profile</Text>
          {renderTasteBar('Sweetness', recipe.sweetness)}
          {renderTasteBar('Saltiness', recipe.saltiness)}
          {renderTasteBar('Sourness', recipe.sourness)}
          {renderTasteBar('Bitterness', recipe.bitterness)}
          {renderTasteBar('Savoriness', recipe.savoriness)}
          {renderTasteBar('Fattiness', recipe.fattiness)}
          {renderTasteBar('Spiciness', recipe.spiciness)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <View style={styles.equipmentContainer}>
            {recipe.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentBadge}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {recipe.nutrition && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <View style={styles.nutritionGrid}>
              {Object.entries(recipe.nutrition).map(([key, value]) => (
                <View key={key} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{value}</Text>
                  <Text style={styles.nutritionLabel}>{key}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Swiping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  metaText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tasteLabel: {
    width: 90,
    fontSize: 14,
    color: '#666',
  },
  tasteBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  tasteBarFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
  },
  tasteValue: {
    width: 30,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#4ECDC4',
    marginRight: 10,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipmentBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  equipmentText: {
    fontSize: 14,
    color: '#666',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  nutritionItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  backButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;