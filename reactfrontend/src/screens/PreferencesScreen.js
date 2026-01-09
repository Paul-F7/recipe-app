import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, SHADOWS, BORDER_RADIUS } from '../constants/theme';

const cuisines = [
  { id: 'italian', name: 'Italian', emoji: '🍝' },
  { id: 'japanese', name: 'Japanese', emoji: '🍱' },
  { id: 'mexican', name: 'Mexican', emoji: '🌮' },
  { id: 'thai', name: 'Thai', emoji: '🍜' },
  { id: 'indian', name: 'Indian', emoji: '🍛' },
  { id: 'french', name: 'French', emoji: '🥐' },
  { id: 'chinese', name: 'Chinese', emoji: '🥡' },
  { id: 'american', name: 'American', emoji: '🍔' },
];

const dietaryOptions = [
  { id: 'vegetarian', name: 'Vegetarian', icon: 'leaf-outline' },
  { id: 'vegan', name: 'Vegan', icon: 'nutrition-outline' },
  { id: 'glutenFree', name: 'Gluten-Free', icon: 'warning-outline' },
  { id: 'dairyFree', name: 'Dairy-Free', icon: 'water-outline' },
  { id: 'keto', name: 'Keto', icon: 'flame-outline' },
  { id: 'lowCarb', name: 'Low Carb', icon: 'trending-down-outline' },
];

const skillLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Simple recipes with basic techniques' },
  { id: 'intermediate', name: 'Intermediate', description: 'More complex dishes and skills' },
  { id: 'advanced', name: 'Advanced', description: 'Challenge yourself with expert recipes' },
];

const PreferencesScreen = () => {
  const [selectedCuisines, setSelectedCuisines] = useState(['italian', 'thai']);
  const [dietaryRestrictions, setDietaryRestrictions] = useState({});
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [maxCookTime, setMaxCookTime] = useState(45);
  const [notifications, setNotifications] = useState(true);

  const toggleCuisine = (id) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleDietary = (id) => {
    setDietaryRestrictions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const timeOptions = [15, 30, 45, 60, 90];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[COLORS.background, '#0A0A0C']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Preferences</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cuisine Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="earth-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Select cuisines you'd like to see more of
          </Text>
          <View style={styles.cuisineGrid}>
            {cuisines.map((cuisine) => (
              <TouchableOpacity
                key={cuisine.id}
                style={[
                  styles.cuisineChip,
                  selectedCuisines.includes(cuisine.id) && styles.cuisineChipActive,
                ]}
                onPress={() => toggleCuisine(cuisine.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.cuisineEmoji}>{cuisine.emoji}</Text>
                <Text
                  style={[
                    styles.cuisineName,
                    selectedCuisines.includes(cuisine.id) && styles.cuisineNameActive,
                  ]}
                >
                  {cuisine.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={22} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          </View>
          <View style={styles.dietaryList}>
            {dietaryOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.dietaryItem}
                onPress={() => toggleDietary(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.dietaryLeft}>
                  <View
                    style={[
                      styles.dietaryIcon,
                      dietaryRestrictions[option.id] && styles.dietaryIconActive,
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={dietaryRestrictions[option.id] ? COLORS.secondary : COLORS.textMuted}
                    />
                  </View>
                  <Text style={styles.dietaryName}>{option.name}</Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    dietaryRestrictions[option.id] && styles.checkboxActive,
                  ]}
                >
                  {dietaryRestrictions[option.id] && (
                    <Ionicons name="checkmark" size={16} color={COLORS.textPrimary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skill Level */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy-outline" size={22} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Skill Level</Text>
          </View>
          <View style={styles.skillList}>
            {skillLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.skillItem,
                  skillLevel === level.id && styles.skillItemActive,
                ]}
                onPress={() => setSkillLevel(level.id)}
                activeOpacity={0.7}
              >
                <View style={styles.skillContent}>
                  <Text
                    style={[
                      styles.skillName,
                      skillLevel === level.id && styles.skillNameActive,
                    ]}
                  >
                    {level.name}
                  </Text>
                  <Text style={styles.skillDescription}>{level.description}</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    skillLevel === level.id && styles.radioOuterActive,
                  ]}
                >
                  {skillLevel === level.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Max Cook Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Max Cooking Time</Text>
          </View>
          <View style={styles.timeOptions}>
            {timeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeChip, maxCookTime === time && styles.timeChipActive]}
                onPress={() => setMaxCookTime(time)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.timeText,
                    maxCookTime === time && styles.timeTextActive,
                  ]}
                >
                  {time} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Toggle */}
        <View style={styles.section}>
          <View style={styles.notificationRow}>
            <View style={styles.notificationLeft}>
              <View style={styles.notificationIcon}>
                <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
              </View>
              <View>
                <Text style={styles.notificationTitle}>Daily Recommendations</Text>
                <Text style={styles.notificationSubtitle}>
                  Get personalized recipe suggestions
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    fontSize: 26,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xl + SPACING.sm,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cuisineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  cuisineChipActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderColor: COLORS.primary,
  },
  cuisineEmoji: {
    fontSize: 18,
  },
  cuisineName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  cuisineNameActive: {
    color: COLORS.textPrimary,
  },
  dietaryList: {
    gap: SPACING.sm,
  },
  dietaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  dietaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dietaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietaryIconActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  dietaryName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.medium,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  skillList: {
    gap: SPACING.sm,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  skillItemActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 230, 109, 0.1)',
  },
  skillContent: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
    marginBottom: 2,
  },
  skillNameActive: {
    color: COLORS.accent,
  },
  skillDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  timeChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  timeChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  timeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  timeTextActive: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.medium,
  },
  notificationSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  bottomSpacer: {
    height: 140,
  },
});

export default PreferencesScreen;