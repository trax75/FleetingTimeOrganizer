import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { TimerWidget, TimerWidgetDefault } from './TimerWidget';
import {
  getDayProgress,
  getWeekProgress,
  getMonthProgress,
  getYearProgress,
  calculateProgress,
  formatDuration,
  STORAGE_KEYS,
} from '@ultimate-timer/shared';
import type { Timer } from '@ultimate-timer/shared';

const WIDGET_CONFIG_KEY = 'widget-timer-config';

interface WidgetTimerConfig {
  timerId: string;
}

async function getTimers(): Promise<Timer[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TIMERS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.state?.timers || parsed.timers || [];
  } catch {
    return [];
  }
}

async function getWidgetConfig(): Promise<WidgetTimerConfig | null> {
  try {
    const data = await AsyncStorage.getItem(WIDGET_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function getTimerProgress(timer: Timer, weekStart: 'monday' | 'sunday' = 'monday') {
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
      return null;
    default:
      return null;
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  const { widgetAction, renderWidget } = props;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK': {
      // Get configured timer or default to first timer
      const config = await getWidgetConfig();
      const timers = await getTimers();

      let timer: Timer | undefined;
      if (config?.timerId) {
        timer = timers.find((t) => t.id === config.timerId);
      }
      // Fallback to first timer
      if (!timer && timers.length > 0) {
        timer = timers[0];
      }

      if (!timer) {
        renderWidget(<TimerWidgetDefault />);
        return;
      }

      const progress = getTimerProgress(timer);
      if (!progress) {
        renderWidget(<TimerWidgetDefault />);
        return;
      }

      const currentMode = timer.viewMode || timer.mode;
      const isRemaining = currentMode === 'remaining';
      const displayPercent = isRemaining ? 100 - progress.percent : progress.percent;
      const timeMs = isRemaining ? progress.remainingMs : progress.elapsedMs;
      const timeRemaining = formatDuration(timeMs);

      renderWidget(
        <TimerWidget
          timerName={timer.name}
          percent={displayPercent}
          timeRemaining={`${timeRemaining} ${isRemaining ? 'left' : 'elapsed'}`}
        />
      );
      return;
    }

    case 'WIDGET_DELETED':
      // Nothing to do when widget is deleted
      return;

    default:
      renderWidget(<TimerWidgetDefault />);
      return;
  }
}
