/**
 * Data Migration Strategy for Fleeting Time
 * ==========================================
 *
 * This module handles schema migrations for persisted data in AsyncStorage.
 *
 * ## Strategy Overview
 *
 * 1. **Version Tracking**: Each persisted state includes a `version` number
 * 2. **Forward-Only**: Migrations only go forward (v0 → v1 → v2)
 * 3. **Non-Destructive**: Old data is preserved during migration
 * 4. **Lazy Migration**: Migrations run on app start when version mismatch detected
 *
 * ## Adding a New Migration
 *
 * 1. Increment SCHEMA_VERSION in types/index.ts
 * 2. Add migration function: migrateVxToVy()
 * 3. Register in MIGRATIONS array below
 * 4. Test with both fresh install and upgrade scenarios
 *
 * ## Current Schema Versions
 *
 * - v0: Legacy (no version field) - original UltimateTimer fork
 * - v1: MVP schema with Mood, Widget, Share types
 */

import {
  SCHEMA_VERSION,
  type PersistedTimerState,
  type PersistedLifeTimerState,
  type Timer,
  type LifeTimer,
  type LifeTimerData,
  type LifeExpectancyResult,
} from '../types';

// =============================================================================
// Migration Types
// =============================================================================

type MigrationFn<T> = (data: unknown) => T;

interface Migration<T> {
  fromVersion: number;
  toVersion: number;
  migrate: MigrationFn<T>;
}

// =============================================================================
// Timer Migrations
// =============================================================================

/**
 * v0 → v1: Add version field, ensure all timers have required fields
 */
function migrateTimerV0ToV1(data: unknown): PersistedTimerState {
  const legacy = data as { timers?: Timer[]; initialized?: boolean } | null;

  return {
    version: 1,
    timers: (legacy?.timers || []).map((timer) => ({
      ...timer,
      kind: timer.kind || (timer.type === 'custom' ? 'custom' : 'standard'),
      viewMode: timer.viewMode || timer.mode,
    })),
    initialized: legacy?.initialized ?? false,
  };
}

const TIMER_MIGRATIONS: Migration<PersistedTimerState>[] = [
  { fromVersion: 0, toVersion: 1, migrate: migrateTimerV0ToV1 },
];

// =============================================================================
// Life Timer Migrations
// =============================================================================

/**
 * v0 → v1: Migrate legacy single-timer format to multi-timer array
 */
function migrateLifeTimerV0ToV1(data: unknown): PersistedLifeTimerState {
  const legacy = data as {
    lifeTimers?: LifeTimer[];
    lifeTimerData?: unknown;
    lifeExpectancyResult?: unknown;
  } | null;

  // If already has lifeTimers array, just add version
  if (legacy?.lifeTimers && legacy.lifeTimers.length > 0) {
    return {
      version: 1,
      lifeTimers: legacy.lifeTimers,
    };
  }

  // Migrate legacy single-timer to array format
  // Legacy data is kept in store for reference but not actively used
  return {
    version: 1,
    lifeTimers: [],
    lifeTimerData: (legacy?.lifeTimerData as LifeTimerData | null) ?? null,
    lifeExpectancyResult: (legacy?.lifeExpectancyResult as LifeExpectancyResult | null) ?? null,
  };
}

const LIFE_TIMER_MIGRATIONS: Migration<PersistedLifeTimerState>[] = [
  { fromVersion: 0, toVersion: 1, migrate: migrateLifeTimerV0ToV1 },
];

// =============================================================================
// Migration Runner
// =============================================================================

/**
 * Detects version from persisted data (v0 has no version field)
 */
function detectVersion(data: unknown): number {
  if (!data || typeof data !== 'object') return 0;
  const versioned = data as { version?: number };
  return versioned.version ?? 0;
}

/**
 * Runs all necessary migrations sequentially
 */
function runMigrations<T>(
  data: unknown,
  migrations: Migration<T>[],
  targetVersion: number
): T {
  let currentVersion = detectVersion(data);
  let currentData = data;

  while (currentVersion < targetVersion) {
    const migration = migrations.find((m) => m.fromVersion === currentVersion);

    if (!migration) {
      console.warn(
        `No migration found from v${currentVersion} to v${currentVersion + 1}`
      );
      break;
    }

    console.log(
      `Migrating from v${migration.fromVersion} to v${migration.toVersion}`
    );
    currentData = migration.migrate(currentData);
    currentVersion = migration.toVersion;
  }

  return currentData as T;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Migrate timer store data to current schema version
 */
export function migrateTimerData(data: unknown): PersistedTimerState {
  return runMigrations(data, TIMER_MIGRATIONS, SCHEMA_VERSION);
}

/**
 * Migrate life timer store data to current schema version
 */
export function migrateLifeTimerData(data: unknown): PersistedLifeTimerState {
  return runMigrations(data, LIFE_TIMER_MIGRATIONS, SCHEMA_VERSION);
}

/**
 * Check if data needs migration
 */
export function needsMigration(data: unknown): boolean {
  return detectVersion(data) < SCHEMA_VERSION;
}

export { SCHEMA_VERSION };
