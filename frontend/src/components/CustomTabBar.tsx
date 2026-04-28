import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Compass, Settings } from 'lucide-react-native';

import { Colors } from '../constants/theme';
import PressableScale from './PressableScale';
import { TAB_BAR_MAX_WIDTH } from '../constants/responsive';

const CENTER_ROUTE = 'Discovery';
const PRESS_RETENTION_OFFSET = { top: 8, bottom: 8, left: 8, right: 8 };
const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;
          const isCenter = route.name === CENTER_ROUTE;

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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const Icon = route.name === 'Liked' ? Heart : route.name === CENTER_ROUTE ? Compass : Settings;
          const iconColor = isCenter
            ? isFocused
              ? Colors.dark.success
              : Colors.dark.textSecondary
            : isFocused
              ? Colors.dark.success
              : Colors.dark.textSecondary;
          const iconFill = route.name === 'Liked' && isFocused ? iconColor : 'none';

          if (isCenter) {
            return (
              <PressableScale
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={typeof label === 'string' ? label : undefined}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                pressRetentionOffset={PRESS_RETENTION_OFFSET}
                hitSlop={HIT_SLOP}
                style={styles.centerButtonContainer}
                scaleTo={0.97}
                durationIn={28}
                durationOut={55}
                delayPressIn={0}
                delayPressOut={0}
              >
                <View style={[styles.centerButtonOuter, isFocused && styles.centerButtonOuterActive]}>
                  <LinearGradient
                    colors={
                      isFocused
                        ? [Colors.dark.cardLight, Colors.dark.card]
                        : [Colors.dark.cardLight, Colors.dark.card]
                    }
                    style={styles.centerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon
                      size={30}
                      color={iconColor}
                      fill={iconFill}
                    />
                  </LinearGradient>
                </View>
              </PressableScale>
            );
          }

          return (
            <PressableScale
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={typeof label === 'string' ? label : undefined}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              pressRetentionOffset={PRESS_RETENTION_OFFSET}
              hitSlop={HIT_SLOP}
              scaleTo={0.96}
              durationIn={24}
              durationOut={50}
              delayPressIn={0}
              delayPressOut={0}
            >
              <View style={[styles.tabIconContainer, isFocused && styles.tabIconContainerActive]}>
                <Icon size={26} color={iconColor} fill={iconFill} />
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 22,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: TAB_BAR_MAX_WIDTH,
    backgroundColor: Colors.dark.card,
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: Colors.dark.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(52, 199, 89, 0.18)',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -32,
  },
  centerButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 4,
    backgroundColor: Colors.dark.background,
    shadowColor: Colors.dark.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  centerButtonOuterActive: {
    shadowColor: Colors.dark.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  centerButton: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
