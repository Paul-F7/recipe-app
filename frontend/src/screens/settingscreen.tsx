import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Coffee,
  CupSoda,
  Flame,
  IceCream,
  Leaf,
  MilkOff,
  Sandwich,
  Settings,
  Utensils,
  WheatOff,
} from 'lucide-react-native';

import { Colors } from '../constants/theme';
import { DishType, DietType } from '../types';
import { usePreferences } from '../context/PreferencesContext';

const dishTypes: { id: DishType; label: string; icon: typeof Settings; color: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#fbbf24' },
  { id: 'lunch', label: 'Lunch', icon: Sandwich, color: '#60a5fa' },
  { id: 'dinner', label: 'Dinner', icon: Utensils, color: '#34d399' },
  { id: 'dessert', label: 'Dessert', icon: IceCream, color: '#f472b6' },
  { id: 'drink', label: 'Drinks', icon: CupSoda, color: '#a78bfa' },
];

const dietTypes: { id: DietType; label: string; color: string; icon: typeof Settings }[] = [
  { id: 'Vegetarian', label: 'Vegetarian', color: '#4ade80', icon: Leaf },
  { id: 'Gluten Free', label: 'Gluten Free', color: '#fbbf24', icon: WheatOff },
  { id: 'Keto', label: 'Keto', color: '#60a5fa', icon: Flame },
  { id: 'Lactose-Free', label: 'Lactose-Free', color: '#c084fc', icon: MilkOff },
];

export default function SettingsScreen() {
  const { preferences, toggleCategory, toggleDiet } = usePreferences();
  const selectedCategories = preferences.categories;
  const selectedDiets = preferences.diets || [];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#050704', '#0f1a0a', '#050704']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Settings size={34} color={Colors.dark.textPrimary} />
          <Text style={styles.headerTitle}>Preferences</Text>
        </View>
        <Text style={styles.headerSubtitle}>Customize your recipe feed</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={[styles.section, styles.categorySection]}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Categories</Text>
            <Text style={styles.categorySubtitle}>Pick the meals you want to see</Text>
          </View>
          <View style={styles.categoryGrid}>
            {dishTypes.map((item) => {
              const isSelected = selectedCategories.includes(item.id);
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionCard,
                    styles.categoryOptionCard,
                    isSelected && styles.optionCardSelected,
                    isSelected && { borderColor: item.color, backgroundColor: `${item.color}22` },
                  ]}
                  onPress={() => toggleCategory(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      { borderColor: item.color, backgroundColor: `${item.color}22` },
                      isSelected && { backgroundColor: `${item.color}44` },
                    ]}
                  >
                    <Icon size={12} color={item.color} />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      styles.categoryOptionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, styles.dietarySection]}>
          <View style={styles.dietaryHeader}>
            <Text style={styles.dietaryTitle}>Dietary Preferences</Text>
            <Text style={styles.dietarySubtitle}>Choose what fits your diet</Text>
          </View>
          <View style={styles.dietaryGrid}>
            {dietTypes.map((item) => {
              const isSelected = selectedDiets.includes(item.id);
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionCard,
                    styles.categoryOptionCard,
                    isSelected && styles.optionCardSelected,
                    isSelected && { borderColor: item.color, backgroundColor: `${item.color}22` },
                  ]}
                  onPress={() => toggleDiet(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      { borderColor: item.color, backgroundColor: `${item.color}22` },
                      isSelected && { backgroundColor: `${item.color}44` },
                    ]}
                  >
                    <Icon size={12} color={item.color} />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      styles.categoryOptionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
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
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
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
  categorySection: {
    backgroundColor: 'rgba(6, 10, 6, 0.65)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  categoryHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  categorySubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    rowGap: 14,
  },
  dietarySection: {
    backgroundColor: 'rgba(6, 10, 6, 0.65)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  dietaryHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  dietaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  dietarySubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    rowGap: 14,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  categoryOptionCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderRadius: 12,
  },
  optionIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  categoryOptionLabel: {
    fontSize: 14,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(148, 163, 184, 0.45)',
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  optionLabelSelected: {
    color: Colors.dark.textPrimary,
  },
});
