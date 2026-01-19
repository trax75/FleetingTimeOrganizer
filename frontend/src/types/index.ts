export type TimerMode = 'elapsed' | 'remaining';

export type TimerType = 'day' | 'week' | 'month' | 'year' | 'custom' | 'life';

export interface Timer {
  id: string;
  name: string;
  type: TimerType;
  mode: TimerMode;
  startDate?: string; // ISO string for custom timers
  endDate?: string;   // ISO string for custom timers
  createdAt: string;
}

export interface TimerProgress {
  percent: number;        // 0-100
  elapsedMs: number;
  remainingMs: number;
  totalMs: number;
  status: 'not-started' | 'in-progress' | 'ended';
}

export type WeekStart = 'monday' | 'sunday';

export type PercentDecimals = 1 | 2 | 3;

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  weekStart: WeekStart;
  percentDecimals: PercentDecimals;
}

export type Sex = 'male' | 'female' | 'unspecified';

export type SmokingStatus = 'never' | 'former' | 'current';

export type ActivityLevel = 'sedentary' | 'moderate' | 'active';

export type ChronicCondition = 'none' | 'cardiovascular' | 'diabetes' | 'cancer' | 'respiratory' | 'other';

export interface LifeTimerData {
  birthDate: string; // ISO date string (YYYY-MM-DD)
  country: string;   // ISO 3166-1 alpha-2 country code
  sex: Sex;
  smokingStatus: SmokingStatus;
  activityLevel: ActivityLevel;
  parentReached85: 'yes' | 'no' | 'unknown';
  chronicCondition: ChronicCondition;
}

export interface LifeExpectancyResult {
  baselineYears: number;
  adjustedYears: number;
  rangeMin: number;
  rangeMax: number;
  source: string;
  fetchedAt: string;
}

export interface LifeTimerProgress extends TimerProgress {
  estimatedLifespan: number;
  rangeMin: number;
  rangeMax: number;
  yearsLived: number;
  yearsRemaining: number;
  monthsRemaining: number;
  daysRemaining: number;
}

export interface WorldBankCacheEntry {
  data: Record<string, number>;
  fetchedAt: string;
}
