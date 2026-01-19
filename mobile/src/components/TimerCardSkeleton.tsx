import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export function TimerCardSkeleton() {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Donut placeholder */}
      <Animated.View
        style={[
          styles.donutPlaceholder,
          {
            backgroundColor: theme.border,
            opacity,
          },
        ]}
      />
      {/* Title placeholder */}
      <Animated.View
        style={[
          styles.titlePlaceholder,
          {
            backgroundColor: theme.border,
            opacity,
          },
        ]}
      />
      {/* Subtitle placeholder */}
      <Animated.View
        style={[
          styles.subtitlePlaceholder,
          {
            backgroundColor: theme.border,
            opacity,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  titlePlaceholder: {
    width: '60%',
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  subtitlePlaceholder: {
    width: '40%',
    height: 12,
    borderRadius: 6,
  },
});
