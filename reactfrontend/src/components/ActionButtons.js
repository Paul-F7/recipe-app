import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

const ActionButtons = ({ onDislike, onLike, onSuperLike }) => {
  return (
    <View style={styles.container}>
      {/* Dislike Button */}
      <TouchableOpacity
        style={[styles.button, styles.sideButton]}
        onPress={onDislike}
        activeOpacity={0.8}
      >
        <View style={[styles.buttonInner, styles.dislikeButton]}>
          <Ionicons name="close" size={28} color={COLORS.dislike} />
        </View>
      </TouchableOpacity>

      {/* Super Like / Bookmark Button */}
      <TouchableOpacity
        style={[styles.button, styles.centerButton]}
        onPress={onSuperLike}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.accent, '#FFD93D']}
          style={styles.superLikeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="star" size={24} color={COLORS.background} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Like Button */}
      <TouchableOpacity
        style={[styles.button, styles.sideButton]}
        onPress={onLike}
        activeOpacity={0.8}
      >
        <View style={[styles.buttonInner, styles.likeButton]}>
          <Ionicons name="heart" size={28} color={COLORS.like} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  button: {
    ...SHADOWS.md,
  },
  sideButton: {
    width: 60,
    height: 60,
  },
  centerButton: {
    width: 50,
    height: 50,
  },
  buttonInner: {
    flex: 1,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dislikeButton: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderColor: COLORS.dislike,
  },
  likeButton: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: COLORS.like,
  },
  superLikeGradient: {
    flex: 1,
    width: '100%',
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActionButtons;
