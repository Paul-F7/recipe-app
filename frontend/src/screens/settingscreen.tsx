import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/theme';
import { DishType, DietType } from '../types';
import { usePreferences } from '../context/PreferencesContext';

const dishTypes: { id: DishType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'drink', label: 'Drinks' },
];

const dietTypes: { id: DietType; label: string }[] = [
  { id: 'Vegan', label: 'Vegan' },
  { id: 'Vegetarian', label: 'Vegetarian' },
  { id: 'Gluten Free', label: 'Gluten Free' },
  { id: 'Keto', label: 'Keto' },
  { id: 'Paleo', label: 'Paleo' },
  { id: 'Lactose-Free', label: 'Lactose-Free' },
];

export default function SettingsScreen() {
  const { preferences, toggleCategory, toggleDiet } = usePreferences();
  const selectedCategories = preferences.categories;
  const selectedDiets = preferences.diets || [];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a0a0a', '#0a0a0a']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Preferences</Text>
        <Text style={styles.headerSubtitle}>Customize your recipe feed</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.optionsGrid}>
            {dishTypes.map((item) => {
              const isSelected = selectedCategories.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => toggleCategory(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <View style={styles.optionsGrid}>
            {dietTypes.map((item) => {
              const isSelected = selectedDiets.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => toggleDiet(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  optionCardSelected: {
    backgroundColor: Colors.dark.cardLight,
    borderColor: Colors.dark.accent,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  optionLabelSelected: {
    color: Colors.dark.textPrimary,
  },
});