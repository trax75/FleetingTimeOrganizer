export type TimerMode = 'elapsed' | 'remaining';

export type TimerType = 'day' | 'week' | 'month' | 'year' | 'custom' | 'life';

export type TimerTimeframe = 'day' | 'week' | 'month' | 'year';

export type TimerKind = 'standard' | 'custom' | 'life';

export type PercentDecimals = 1 | 2 | 3;

// -----------------------------------------------------------------------------
// Notification Settings
// -----------------------------------------------------------------------------

export type NotificationThreshold = 50 | 80 | 100;

export interface TimerNotificationConfig {
  enabled: boolean;
  thresholds: NotificationThreshold[]; // e.g. [50, 80, 100]
}

export interface Timer {
  id: string;
  name: string;
  type: TimerType;
  mode: TimerMode;
  startDate?: string; // ISO string for custom timers
  endDate?: string;   // ISO string for custom timers
  createdAt: string;
  // Mobile-specific fields
  kind?: TimerKind;
  viewMode?: TimerMode;        // Current toggle status for mobile
  defaultViewMode?: TimerMode; // For custom timers
  notificationId?: string;     // Scheduled notification ID for end-date alerts (legacy)
  notifications?: TimerNotificationConfig; // New: configurable notification thresholds
  scheduledNotificationIds?: Record<NotificationThreshold, string>; // IDs per threshold
}

export interface TimerProgress {
  percent: number;        // 0-100
  elapsedMs: number;
  remainingMs: number;
  totalMs: number;
  status: 'not-started' | 'in-progress' | 'ended';
}

export type WeekStart = 'monday' | 'sunday';

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
  chronicConditions: ChronicCondition[]; // Array for multiple conditions
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

export interface LifeTimer {
  id: string;
  name: string;
  data: LifeTimerData;
  result: LifeExpectancyResult;
  createdAt: string;
}

// =============================================================================
// MVP SCHEMA EXTENSIONS (Epic 1.1)
// =============================================================================

/**
 * Schema Version for migrations
 * Increment when making breaking changes to stored data structures
 */
export const SCHEMA_VERSION = 1;

// -----------------------------------------------------------------------------
// Mood Tracking (Post-Timer Feedback)
// -----------------------------------------------------------------------------

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  timerId: string;
  timerType: TimerType;
  rating: MoodRating;
  note?: string;
  recordedAt: string; // ISO timestamp
}

// -----------------------------------------------------------------------------
// Widget Data Schema
// -----------------------------------------------------------------------------

export type WidgetSize = '2x1' | '2x2' | '4x1' | '4x2';

export interface WidgetConfig {
  id: string;
  timerId: string;           // Reference to Timer or LifeTimer
  timerType: 'timer' | 'life';
  size: WidgetSize;
  showPercentage: boolean;
  showTimeRemaining: boolean;
  createdAt: string;
}

export interface WidgetData {
  timerId: string;
  timerName: string;
  percent: number;
  displayText: string;       // Pre-formatted for widget
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Share Intent Schema
// -----------------------------------------------------------------------------

export interface ShareableTimer {
  version: number;           // Schema version for compatibility
  type: 'custom';            // Only custom timers are shareable
  name: string;
  startDate: string;         // ISO date
  endDate: string;           // ISO date
  mode: TimerMode;
}

export interface ShareableTimerLink {
  /** Base64 encoded ShareableTimer */
  payload: string;
  /** Short hash for validation */
  checksum: string;
}

// -----------------------------------------------------------------------------
// Store State Interfaces (for type-safe persistence)
// -----------------------------------------------------------------------------

export interface PersistedTimerState {
  version: number;
  timers: Timer[];
  initialized: boolean;
}

export interface PersistedLifeTimerState {
  version: number;
  lifeTimers: LifeTimer[];
  // Legacy fields (v0) - kept for migration
  lifeTimerData?: LifeTimerData | null;
  lifeExpectancyResult?: LifeExpectancyResult | null;
}

export interface PersistedMoodState {
  version: number;
  entries: MoodEntry[];
}

export interface PersistedWidgetState {
  version: number;
  configs: WidgetConfig[];
}
