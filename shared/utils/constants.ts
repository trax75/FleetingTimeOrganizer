import type { Timer, Settings, LifeTimerData, TimerTimeframe } from '../types';
import { generateId } from './timeCalculations';

export const STORAGE_KEYS = {
  TIMERS: 'ultimate_timer_timers',
  SETTINGS: 'ultimate_timer_settings',
  LIFE_TIMER: 'ultimate_timer_life',
  LIFE_TIMER_RESULT: 'ultimate_timer_life_result',
  MOBILE_INITIALIZED: 'ultimate_timer_mobile_initialized',
} as const;

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  weekStart: 'monday',
  percentDecimals: 1,
};

export const DEFAULT_LIFE_TIMER_DATA: LifeTimerData = {
  birthDate: '',
  country: 'DE',
  sex: 'unspecified',
  smokingStatus: 'never',
  activityLevel: 'moderate',
  parentReached85: 'unknown',
  chronicConditions: [],
};

export function createDefaultTimers(): Timer[] {
  const now = new Date().toISOString();

  return [
    {
      id: generateId(),
      name: 'Day',
      type: 'day',
      mode: 'elapsed',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Day',
      type: 'day',
      mode: 'remaining',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Week',
      type: 'week',
      mode: 'elapsed',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Week',
      type: 'week',
      mode: 'remaining',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Month',
      type: 'month',
      mode: 'elapsed',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Month',
      type: 'month',
      mode: 'remaining',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Year',
      type: 'year',
      mode: 'elapsed',
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Year',
      type: 'year',
      mode: 'remaining',
      createdAt: now,
    },
  ];
}

export const TIMER_UPDATE_INTERVAL = 1000; // 1 second

/**
 * Create default timers for Mobile (4 toggleable timers)
 * Each timer can be toggled between elapsed/remaining view
 */
export function createMobileDefaultTimers(): Timer[] {
  const now = new Date().toISOString();
  const timeframes: TimerTimeframe[] = ['day', 'week', 'month', 'year'];

  return timeframes.map((timeframe) => ({
    id: generateId(),
    name: timeframe.charAt(0).toUpperCase() + timeframe.slice(1),
    type: timeframe,
    mode: 'elapsed' as const,
    kind: 'standard' as const,
    viewMode: 'elapsed' as const,
    createdAt: now,
  }));
}

export const LIFE_TIMER_DISCLAIMER = `
This estimate is based on population statistics from the World Bank and self-reported lifestyle factors.
It is for informational and entertainment purposes only.

**This is NOT medical advice.**

Individual outcomes vary significantly based on genetics, healthcare access, lifestyle choices,
environmental factors, and countless other variables not captured here.
Consult healthcare professionals for personal health guidance.
`.trim();
