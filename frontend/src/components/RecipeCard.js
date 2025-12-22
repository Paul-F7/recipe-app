import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const RecipeCard = ({ recipe }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: recipe.image_url }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          
          {recipe.cook_time_minutes && (
            <Text style={styles.cookTime}>
              🕐 {recipe.cook_time_minutes} minutes
            </Text>
          )}
          
          <View style={styles.categories}>
            {recipe.dish_type.map((type, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{type}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tasteAttributes}>
            {recipe.sweetness > 50 && (
              <View style={styles.tasteBadge}>
                <Text style={styles.tasteText}>🍰 Sweet</Text>
              </View>
            )}
            {recipe.spiciness > 50 && (
              <View style={styles.tasteBadge}>
                <Text style={styles.tasteText}>🌶️ Spicy</Text>
              </View>
            )}
            {recipe.savoriness > 50 && (
              <View style={styles.tasteBadge}>
                <Text style={styles.tasteText}>🧂 Savory</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cookTime: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tasteAttributes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tasteBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
  },
  tasteText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default RecipeCard;