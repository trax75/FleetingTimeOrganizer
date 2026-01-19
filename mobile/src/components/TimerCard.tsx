import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Timer, TimerProgress, PercentDecimals } from '@ultimate-timer/shared';
import { formatDuration, formatPercent } from '@ultimate-timer/shared';
import { DonutChart } from './DonutChart';
import { useTheme } from '../hooks/useTheme';
import { colors } from '../theme/colors';

interface TimerCardProps {
  timer: Timer;
  progress: TimerProgress;
  percentDecimals: PercentDecimals;
  onPress: () => void;
  onLongPress?: () => void;
}

const TIMER_COLORS: Record<string, string> = {
  day: colors.timer.day,
  week: colors.timer.week,
  month: colors.timer.month,
  year: colors.timer.year,
  custom: colors.timer.custom,
  life: colors.timer.life,
};

export function TimerCard({
  timer,
  progress,
  percentDecimals,
  onPress,
  onLongPress,
}: TimerCardProps) {
  const { theme } = useTheme();
  const color = TIMER_COLORS[timer.type] || TIMER_COLORS.custom;

  const currentMode = timer.viewMode || timer.mode;
  const isRemaining = currentMode === 'remaining';

  // Show correct percentage based on mode
  const displayPercent = isRemaining ? 100 - progress.percent : progress.percent;

  const timeDisplay = isRemaining
    ? formatDuration(progress.remainingMs)
    : formatDuration(progress.elapsedMs);

  const modeLabel = isRemaining ? 'remaining' : 'elapsed';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>{timer.name}</Text>

      {/* Mode badge */}
      <View
        style={[
          styles.badge,
          { backgroundColor: `${color}20` },
        ]}
      >
        <Text style={[styles.badgeText, { color }]}>{modeLabel}</Text>
      </View>

      {/* Donut chart with percentage */}
      <View style={styles.chartContainer}>
        <DonutChart percent={displayPercent} size={100} strokeWidth={8} color={color} />
        <View style={styles.percentOverlay}>
          <Text style={[styles.percent, { color: theme.text }]}>
            {formatPercent(displayPercent, percentDecimals)}
          </Text>
        </View>
      </View>

      {/* Time display */}
      <Text style={[styles.time, { color: theme.textSecondary }]}>
        {timeDisplay} {modeLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percent: {
    fontSize: 20,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
