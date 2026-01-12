import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  durationIn?: number;
  durationOut?: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PressableScale({
  style,
  scaleTo = 0.97,
  durationIn = 50,
  durationOut = 80,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = useCallback(
    (toValue: number, duration: number) => {
      Animated.timing(scale, {
        toValue,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    [scale]
  );

  const handlePressIn = useCallback(
    (event) => {
      onPressIn?.(event);
      if (disabled) return;
      animateTo(scaleTo, durationIn);
    },
    [onPressIn, disabled, animateTo, scaleTo, durationIn]
  );

  const handlePressOut = useCallback(
    (event) => {
      onPressOut?.(event);
      if (disabled) return;
      animateTo(1, durationOut);
    },
    [onPressOut, disabled, animateTo, durationOut]
  );

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, { transform: [{ scale }] }]}
    />
  );
}
