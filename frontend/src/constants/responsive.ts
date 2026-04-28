import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isTablet =
  Platform.OS === 'ios' && (Platform as any).isPad === true
    ? true
    : Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) >= 600;

export const CONTENT_MAX_WIDTH = isTablet ? 560 : SCREEN_WIDTH;
export const CARD_MAX_WIDTH = isTablet ? 560 : SCREEN_WIDTH;
export const CARD_MAX_HEIGHT = SCREEN_HEIGHT;
export const TAB_BAR_MAX_WIDTH = isTablet ? 520 : SCREEN_WIDTH;

export const HORIZONTAL_INSET = isTablet
  ? Math.max(0, (SCREEN_WIDTH - CONTENT_MAX_WIDTH) / 2)
  : 0;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
