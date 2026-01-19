import type { TimerProgress, WeekStart } from '../types';

/**
 * Get the start of day (local midnight) for a given date
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of day (23:59:59.999) for a given date
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get the start of the week containing the given date
 * Handles both Monday (ISO) and Sunday week starts
 */
export function startOfWeek(date: Date, weekStart: WeekStart = 'monday'): Date {
  const result = new Date(date);
  const day = result.getDay();

  let diff: number;
  if (weekStart === 'monday') {
    // Monday = 1, so we need to go back (day - 1) days, handling Sunday (0) as 7
    diff = day === 0 ? 6 : day - 1;
  } else {
    // Sunday = 0
    diff = day;
  }

  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of the week containing the given date
 */
export function endOfWeek(date: Date, weekStart: WeekStart = 'monday'): Date {
  const start = startOfWeek(date, weekStart);
  const result = new Date(start);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get the start of the month containing the given date
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  return result;
}

/**
 * Get the end of the month containing the given date
 */
export function endOfMonth(date: Date): Date {
  // Go to next month, then back one day
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return result;
}

/**
 * Get the start of the year containing the given date
 */
export function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}

/**
 * Get the end of the year containing the given date
 */
export function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

/**
 * Calculate progress between two dates
 * Returns clamped values (0-100%)
 * Handles edge cases like not started, ended, and DST
 */
export function calculateProgress(
  now: Date,
  start: Date,
  end: Date
): TimerProgress {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const nowMs = now.getTime();

  const totalMs = endMs - startMs;

  // Guard against invalid ranges
  if (totalMs <= 0) {
    return {
      percent: 100,
      elapsedMs: 0,
      remainingMs: 0,
      totalMs: 0,
      status: 'ended',
    };
  }

  // Not started yet
  if (nowMs < startMs) {
    return {
      percent: 0,
      elapsedMs: 0,
      remainingMs: totalMs,
      totalMs,
      status: 'not-started',
    };
  }

  // Already ended
  if (nowMs > endMs) {
    return {
      percent: 100,
      elapsedMs: totalMs,
      remainingMs: 0,
      totalMs,
      status: 'ended',
    };
  }

  // In progress
  const elapsedMs = nowMs - startMs;
  const remainingMs = endMs - nowMs;
  const percent = clamp((elapsedMs / totalMs) * 100, 0, 100);

  return {
    percent,
    elapsedMs,
    remainingMs,
    totalMs,
    status: 'in-progress',
  };
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Get day progress (elapsed from midnight to now, out of full day)
 */
export function getDayProgress(now: Date = new Date()): TimerProgress {
  const start = startOfDay(now);
  const end = endOfDay(now);
  return calculateProgress(now, start, end);
}

/**
 * Get week progress
 */
export function getWeekProgress(
  now: Date = new Date(),
  weekStart: WeekStart = 'monday'
): TimerProgress {
  const start = startOfWeek(now, weekStart);
  const end = endOfWeek(now, weekStart);
  return calculateProgress(now, start, end);
}

/**
 * Get month progress
 */
export function getMonthProgress(now: Date = new Date()): TimerProgress {
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return calculateProgress(now, start, end);
}

/**
 * Get year progress
 */
export function getYearProgress(now: Date = new Date()): TimerProgress {
  const start = startOfYear(now);
  const end = endOfYear(now);
  return calculateProgress(now, start, end);
}

/**
 * Format milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44); // Average days per month
  const years = Math.floor(days / 365.25); // Account for leap years

  if (years > 0) {
    const remainingMonths = Math.floor((days % 365.25) / 30.44);
    if (remainingMonths > 0) {
      return `${years}y ${remainingMonths}mo`;
    }
    return `${years}y`;
  }

  if (months > 0) {
    const remainingDays = Math.floor(days % 30.44);
    if (remainingDays > 0) {
      return `${months}mo ${remainingDays}d`;
    }
    return `${months}mo`;
  }

  if (days > 0) {
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${days}d`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${seconds}s`;
}

/**
 * Format a percentage with appropriate precision
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%';
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Calculate age in years from birth date
 */
export function calculateAge(birthDate: Date, now: Date = new Date()): number {
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Calculate precise age in years (with decimals)
 */
export function calculatePreciseAge(birthDate: Date, now: Date = new Date()): number {
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const ageMs = now.getTime() - birthDate.getTime();
  return Math.max(0, ageMs / msPerYear);
}

/**
 * Get a date that is X years from now
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Format date to local datetime string for datetime-local input
 */
export function toLocalDateTimeString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
