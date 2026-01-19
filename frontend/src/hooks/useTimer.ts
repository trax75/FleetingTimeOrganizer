import { useState, useEffect } from 'react';
import type { Timer, TimerProgress, WeekStart } from '../types';
import {
  getDayProgress,
  getWeekProgress,
  getMonthProgress,
  getYearProgress,
  calculateProgress,
  parseISODate,
} from '../utils/timeCalculations';
import { TIMER_UPDATE_INTERVAL } from '../utils/constants';

/**
 * Calculate progress for any timer type
 */
export function getTimerProgress(
  timer: Timer,
  weekStart: WeekStart,
  now: Date = new Date()
): TimerProgress {
  let progress: TimerProgress;

  switch (timer.type) {
    case 'day':
      progress = getDayProgress(now);
      break;
    case 'week':
      progress = getWeekProgress(now, weekStart);
      break;
    case 'month':
      progress = getMonthProgress(now);
      break;
    case 'year':
      progress = getYearProgress(now);
      break;
    case 'custom':
      if (timer.startDate && timer.endDate) {
        progress = calculateProgress(
          now,
          parseISODate(timer.startDate),
          parseISODate(timer.endDate)
        );
      } else {
        progress = {
          percent: 0,
          elapsedMs: 0,
          remainingMs: 0,
          totalMs: 0,
          status: 'not-started',
        };
      }
      break;
    default:
      progress = {
        percent: 0,
        elapsedMs: 0,
        remainingMs: 0,
        totalMs: 0,
        status: 'not-started',
      };
  }

  // For "remaining" mode, invert the progress
  if (timer.mode === 'remaining') {
    return {
      ...progress,
      percent: 100 - progress.percent,
    };
  }

  return progress;
}

/**
 * Hook to get real-time timer progress
 */
export function useTimerProgress(
  timer: Timer,
  weekStart: WeekStart
): TimerProgress {
  const [progress, setProgress] = useState<TimerProgress>(() =>
    getTimerProgress(timer, weekStart)
  );

  useEffect(() => {
    // Update immediately
    setProgress(getTimerProgress(timer, weekStart));

    // Set up interval
    const interval = setInterval(() => {
      setProgress(getTimerProgress(timer, weekStart));
    }, TIMER_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [timer, weekStart]);

  return progress;
}

/**
 * Hook to get current time, updated every second
 */
export function useCurrentTime(): Date {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, TIMER_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return time;
}

/**
 * Hook to force re-render on interval
 */
export function useInterval(ms: number): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, ms);

    return () => clearInterval(interval);
  }, [ms]);

  return tick;
}

/**
 * Hook to check if timer is currently active (in progress)
 */
export function useIsTimerActive(
  timer: Timer,
  weekStart: WeekStart
): boolean {
  const progress = useTimerProgress(timer, weekStart);
  return progress.status === 'in-progress';
}
