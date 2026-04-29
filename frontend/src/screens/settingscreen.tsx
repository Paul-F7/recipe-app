import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
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
import PressableScale from '../components/PressableScale';
import { DishType, DietType } from '../types';
import { usePreferences } from '../context/PreferencesContext';
import { CONTENT_MAX_WIDTH, isCompactTabletWindow, isTablet } from '../constants/responsive';

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
const PRESS_RETENTION_OFFSET = { top: 6, bottom: 6, left: 6, right: 6 };
const HEADER_ICON_SIZE = isTablet ? (isCompactTabletWindow ? 32 : 34) : 34;
const OPTION_ICON_SIZE = isTablet ? 16 : 12;
const HEADER_TOP_PADDING = isTablet ? (isCompactTabletWindow ? 44 : 56) : 60;
const HEADER_HORIZONTAL_PADDING = isTablet ? 24 : 24;
const HEADER_BOTTOM_PADDING = isTablet ? (isCompactTabletWindow ? 16 : 20) : 20;
const HEADER_TITLE_SIZE = isTablet ? (isCompactTabletWindow ? 40 : 44) : 42;
const HEADER_SUBTITLE_SIZE = isTablet ? 17 : 16;
const CONTENT_PADDING = isTablet ? 20 : 20;
const CONTENT_BOTTOM_PADDING = isTablet ? 150 : 120;
const SECTION_SPACING = isTablet ? 28 : 32;
const PANEL_PADDING = isTablet ? 18 : 16;
const PANEL_RADIUS = isTablet ? 20 : 20;
const PANEL_HEADER_SPACING = isTablet ? 16 : 16;
const CATEGORY_TITLE_SIZE = isTablet ? (isCompactTabletWindow ? 26 : 28) : 26;
const DIETARY_TITLE_SIZE = isTablet ? (isCompactTabletWindow ? 23 : 24) : 22;
const SUBTITLE_SIZE = isTablet ? 14 : 13;
const GRID_ROW_GAP = isTablet ? 14 : 14;
const OPTION_HORIZONTAL_PADDING = isTablet ? 20 : 14;
const OPTION_VERTICAL_PADDING = isTablet ? 14 : 10;
const OPTION_ICON_BOX_SIZE = isTablet ? 30 : 22;
const OPTION_LABEL_SIZE = isTablet ? 15 : 14;

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
          <Settings size={HEADER_ICON_SIZE} color={Colors.dark.textPrimary} />
          <Text style={styles.headerTitle}>Preferences</Text>
        </View>
        <Text style={styles.headerSubtitle}>Customize your recipe feed</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled
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
                <PressableScale
                  key={item.id}
                  style={[
                    styles.optionCard,
                    styles.categoryOptionCard,
                    isSelected && styles.optionCardSelected,
                    isSelected && { borderColor: item.color, backgroundColor: `${item.color}22` },
                  ]}
                  onPress={() => toggleCategory(item.id)}
                  pressRetentionOffset={PRESS_RETENTION_OFFSET}
                  scaleTo={0.97}
                  durationIn={50}
                  durationOut={80}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      { borderColor: item.color, backgroundColor: `${item.color}22` },
                      isSelected && { backgroundColor: `${item.color}44` },
                    ]}
                  >
                    <Icon size={OPTION_ICON_SIZE} color={item.color} />
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
                </PressableScale>
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
                <PressableScale
                  key={item.id}
                  style={[
                    styles.optionCard,
                    styles.categoryOptionCard,
                    isSelected && styles.optionCardSelected,
                    isSelected && { borderColor: item.color, backgroundColor: `${item.color}22` },
                  ]}
                  onPress={() => toggleDiet(item.id)}
                  pressRetentionOffset={PRESS_RETENTION_OFFSET}
                  scaleTo={0.97}
                  durationIn={50}
                  durationOut={80}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      { borderColor: item.color, backgroundColor: `${item.color}22` },
                      isSelected && { backgroundColor: `${item.color}44` },
                    ]}
                  >
                    <Icon size={OPTION_ICON_SIZE} color={item.color} />
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
                </PressableScale>
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
    paddingTop: HEADER_TOP_PADDING,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingBottom: HEADER_BOTTOM_PADDING,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: HEADER_TITLE_SIZE,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: HEADER_SUBTITLE_SIZE,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: CONTENT_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },
  section: {
    marginBottom: SECTION_SPACING,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 16,
  },
  categorySection: {
    backgroundColor: 'rgba(6, 10, 6, 0.65)',
    borderRadius: PANEL_RADIUS,
    padding: PANEL_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  categoryHeader: {
    marginBottom: PANEL_HEADER_SPACING,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: CATEGORY_TITLE_SIZE,
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
    fontSize: SUBTITLE_SIZE,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    rowGap: GRID_ROW_GAP,
  },
  dietarySection: {
    backgroundColor: 'rgba(6, 10, 6, 0.65)',
    borderRadius: PANEL_RADIUS,
    padding: PANEL_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  dietaryHeader: {
    marginBottom: PANEL_HEADER_SPACING,
    alignItems: 'center',
  },
  dietaryTitle: {
    fontSize: DIETARY_TITLE_SIZE,
    fontWeight: '700',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  dietarySubtitle: {
    fontSize: SUBTITLE_SIZE,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    rowGap: GRID_ROW_GAP,
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
    paddingHorizontal: OPTION_HORIZONTAL_PADDING,
    paddingVertical: OPTION_VERTICAL_PADDING,
    gap: isTablet ? 6 : 8,
    borderRadius: 12,
  },
  optionIcon: {
    width: OPTION_ICON_BOX_SIZE,
    height: OPTION_ICON_BOX_SIZE,
    borderRadius: OPTION_ICON_BOX_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  categoryOptionLabel: {
    fontSize: OPTION_LABEL_SIZE,
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
