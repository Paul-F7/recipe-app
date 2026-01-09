export const COLORS = {
  // Dark theme base
  background: '#0D0D0F',
  surface: '#1A1A1E',
  surfaceLight: '#252529',
  surfaceHighlight: '#2E2E34',

  // Accent colors
  primary: '#FF6B6B',
  primaryDark: '#E55555',
  secondary: '#4ECDC4',
  accent: '#FFE66D',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A5',
  textMuted: '#6B6B70',

  // Status colors
  like: '#4ADE80',
  dislike: '#F87171',

  // Gradients
  cardGradient: ['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)'],
  overlayGradient: ['rgba(13,13,15,0)', 'rgba(13,13,15,0.9)'],
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }),
};

export const FONTS = {
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
};

export const SIZES = {
  cardWidth: 340,
  cardHeight: 520,
  navBarHeight: 80,
  iconSize: {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
};