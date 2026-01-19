import { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  InteractionManager,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import type { Timer, TimerProgress } from '@ultimate-timer/shared';
import {
  getDayProgress,
  getWeekProgress,
  getMonthProgress,
  getYearProgress,
  calculateProgress,
  TIMER_UPDATE_INTERVAL,
} from '@ultimate-timer/shared';
import { useTimerStore } from '../../src/stores/timerStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTheme } from '../../src/hooks/useTheme';
import { useInterval } from '../../src/hooks/useInterval';
import { TimerCard } from '../../src/components/TimerCard';
import { TimerCardSkeleton } from '../../src/components/TimerCardSkeleton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

function getTimerProgress(timer: Timer, weekStart: 'monday' | 'sunday'): TimerProgress {
  const now = new Date();

  switch (timer.type) {
    case 'day':
      return getDayProgress(now);
    case 'week':
      return getWeekProgress(now, weekStart);
    case 'month':
      return getMonthProgress(now);
    case 'year':
      return getYearProgress(now);
    case 'custom':
      if (timer.startDate && timer.endDate) {
        return calculateProgress(
          now,
          new Date(timer.startDate),
          new Date(timer.endDate)
        );
      }
      return {
        percent: 0,
        elapsedMs: 0,
        remainingMs: 0,
        totalMs: 0,
        status: 'not-started',
      };
    default:
      return {
        percent: 0,
        elapsedMs: 0,
        remainingMs: 0,
        totalMs: 0,
        status: 'not-started',
      };
  }
}

function PlusIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

function SunIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
      <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function MoonIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function DashboardScreen() {
  const { theme, isDark } = useTheme();
  const timers = useTimerStore((state) => state.timers);
  const hydrated = useTimerStore((state) => state.hydrated);
  const toggleViewMode = useTimerStore((state) => state.toggleViewMode);
  const weekStart = useSettingsStore((state) => state.weekStart);
  const percentDecimals = useSettingsStore((state) => state.percentDecimals);
  const themeMode = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const toggleDarkMode = useCallback(() => {
    if (themeMode === 'system') {
      // If system, switch to opposite of current
      setTheme(isDark ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(themeMode === 'dark' ? 'light' : 'dark');
    }
  }, [themeMode, isDark, setTheme]);

  // Force re-render every second
  const tick = useInterval(TIMER_UPDATE_INTERVAL);

  // Calculate progress for all timers (recalculate on tick)
  const timerProgresses = useMemo(() => {
    return timers.map((timer) => ({
      timer,
      progress: getTimerProgress(timer, weekStart),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timers, weekStart, tick]);

  const handleTimerPress = useCallback((timer: Timer) => {
    toggleViewMode(timer.id);
  }, [toggleViewMode]);

  const handleTimerLongPress = useCallback((timer: Timer) => {
    if (timer.kind === 'custom' || timer.type === 'custom') {
      router.push(`/timer/${timer.id}`);
    }
  }, []);

  const handleAddTimer = useCallback(() => {
    router.push('/timer/add');
  }, []);

  // Show skeleton while loading (only briefly, since we have default timers)
  const showSkeleton = !hydrated && timers.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Add and Dark Mode Toggle */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Fleeting Time
          </Text>
          <View style={styles.headerActions}>
            {/* Add Custom Timer */}
            <Pressable
              onPress={handleAddTimer}
              style={({ pressed }) => [
                styles.headerButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: 1,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <PlusIcon color={theme.text} size={20} />
            </Pressable>
            {/* Dark Mode Toggle */}
            <Pressable
              onPress={toggleDarkMode}
              style={({ pressed }) => [
                styles.headerButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: 1,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              {isDark ? (
                <SunIcon color={theme.text} size={20} />
              ) : (
                <MoonIcon color={theme.text} size={20} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Timer Grid */}
        <View style={styles.grid}>
          {showSkeleton ? (
            // Show skeleton placeholders while loading
            <>
              <View style={styles.cardWrapper}>
                <TimerCardSkeleton />
              </View>
              <View style={styles.cardWrapper}>
                <TimerCardSkeleton />
              </View>
              <View style={styles.cardWrapper}>
                <TimerCardSkeleton />
              </View>
              <View style={styles.cardWrapper}>
                <TimerCardSkeleton />
              </View>
            </>
          ) : (
            timerProgresses.map(({ timer, progress }) => (
              <View key={timer.id} style={styles.cardWrapper}>
                <TimerCard
                  timer={timer}
                  progress={progress}
                  percentDecimals={percentDecimals}
                  onPress={() => handleTimerPress(timer)}
                  onLongPress={() => handleTimerLongPress(timer)}
                />
              </View>
            ))
          )}
        </View>

        {/* Empty State */}
        {hydrated && timers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No timers yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Tap the button above to add your first timer
            </Text>
          </View>
        )}

        {/* Help text */}
        <View style={styles.helpContainer}>
          <Text style={[styles.helpText, { color: theme.textTertiary }]}>
            Tap a timer to toggle elapsed/remaining view
          </Text>
          <Text style={[styles.helpText, { color: theme.textTertiary }]}>
            Long press custom timers to edit
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 10,
    borderRadius: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 4,
  },
  helpText: {
    fontSize: 12,
  },
});
