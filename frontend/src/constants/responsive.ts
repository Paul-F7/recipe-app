import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TABLET_COMPACT_WIDTH = 700;
const TABLET_COMPACT_HEIGHT = 900;

export const isTablet =
  Platform.OS === 'ios' && (Platform as any).isPad === true
    ? true
    : Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) >= 600;

export const isCompactTabletWindow =
  isTablet && (SCREEN_WIDTH < TABLET_COMPACT_WIDTH || SCREEN_HEIGHT < TABLET_COMPACT_HEIGHT);

export const CONTENT_MAX_WIDTH = isTablet
  ? Math.min(SCREEN_WIDTH - 40, isCompactTabletWindow ? 620 : 720)
  : SCREEN_WIDTH;
export const CARD_MAX_WIDTH = isTablet
  ? SCREEN_WIDTH
  : SCREEN_WIDTH;
export const CARD_MAX_HEIGHT = isTablet
  ? SCREEN_HEIGHT
  : SCREEN_HEIGHT;
export const TAB_BAR_MAX_WIDTH = isTablet ? (isCompactTabletWindow ? 480 : 540) : SCREEN_WIDTH;

export const HORIZONTAL_INSET = isTablet
  ? Math.max(0, (SCREEN_WIDTH - CONTENT_MAX_WIDTH) / 2)
  : 0;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
