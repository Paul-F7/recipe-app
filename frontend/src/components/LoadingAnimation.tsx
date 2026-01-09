import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Leaf } from 'lucide-react-native';
import { Colors } from '../constants/theme';

interface LoadingAnimationProps {
  message?: string;
}

export default function LoadingAnimation({ message = 'Finding recipes for you...' }: LoadingAnimationProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle rotation wobble
    const rotate = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Pulse scale
    const scale = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Dots animation for text
    const dots = Animated.loop(
      Animated.timing(dotsAnim, {
        toValue: 3,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );

    bounce.start();
    rotate.start();
    scale.start();
    dots.start();

    return () => {
      bounce.stop();
      rotate.stop();
      scale.stop();
      dots.stop();
    };
  }, [bounceAnim, rotateAnim, scaleAnim, dotsAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { translateY: bounceAnim },
              { rotate: rotation },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Leaf size={80} color={Colors.dark.success} />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <AnimatedDot key={i} index={i} dotsAnim={dotsAnim} />
        ))}
      </View>
    </View>
  );
}

function AnimatedDot({ index, dotsAnim }: { index: number; dotsAnim: Animated.Value }) {
  const opacity = dotsAnim.interpolate({
    inputRange: [index, index + 0.5, index + 1],
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  const scale = dotsAnim.interpolate({
    inputRange: [index, index + 0.5, index + 1],
    outputRange: [1, 1.3, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  textContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.success,
  },
});
