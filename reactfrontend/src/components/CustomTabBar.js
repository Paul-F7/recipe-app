import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    Liked: { active: 'heart', inactive: 'heart-outline' },
    Discover: { active: 'compass', inactive: 'compass-outline' },
    Preferences: { active: 'options', inactive: 'options-outline' },
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenter = route.name === 'Discover';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.centerButtonContainer}
                activeOpacity={0.8}
              >
                <View style={[styles.centerButtonOuter, isFocused && styles.centerButtonOuterActive]}>
                  <LinearGradient
                    colors={isFocused ? [COLORS.primary, COLORS.primaryDark] : [COLORS.surfaceLight, COLORS.surface]}
                    style={styles.centerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons
                      name={isFocused ? icons[route.name].active : icons[route.name].inactive}
                      size={32}
                      color={isFocused ? COLORS.textPrimary : COLORS.textMuted}
                    />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={[styles.tabIconContainer, isFocused && styles.tabIconContainerActive]}>
                <Ionicons
                  name={isFocused ? icons[route.name].active : icons[route.name].inactive}
                  size={26}
                  color={isFocused ? COLORS.primary : COLORS.textMuted}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -35,
  },
  centerButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 4,
    backgroundColor: COLORS.background,
    ...SHADOWS.lg,
  },
  centerButtonOuterActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  centerButton: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomTabBar;