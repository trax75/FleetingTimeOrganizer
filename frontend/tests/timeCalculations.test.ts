import { describe, it, expect } from 'vitest';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  calculateProgress,
  clamp,
  getDayProgress,
  getWeekProgress,
  getMonthProgress,
  getYearProgress,
  formatDuration,
  formatPercent,
  isLeapYear,
  getDaysInMonth,
  calculateAge,
  calculatePreciseAge,
} from '../src/utils/timeCalculations';

describe('startOfDay', () => {
  it('should return midnight of the same day', () => {
    const date = new Date(2024, 5, 15, 14, 30, 45, 500); // June 15, 2024, 2:30:45.500 PM
    const result = startOfDay(date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('should not mutate the original date', () => {
    const original = new Date(2024, 5, 15, 14, 30);
    const originalTime = original.getTime();
    startOfDay(original);
    expect(original.getTime()).toBe(originalTime);
  });
});

describe('endOfDay', () => {
  it('should return 23:59:59.999 of the same day', () => {
    const date = new Date(2024, 5, 15, 14, 30);
    const result = endOfDay(date);
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});

describe('startOfWeek', () => {
  it('should return Monday for ISO week (default)', () => {
    // Wednesday, June 19, 2024
    const date = new Date(2024, 5, 19, 14, 30);
    const result = startOfWeek(date, 'monday');
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(17); // June 17, 2024
    expect(result.getHours()).toBe(0);
  });

  it('should return Sunday for Sunday week start', () => {
    // Wednesday, June 19, 2024
    const date = new Date(2024, 5, 19, 14, 30);
    const result = startOfWeek(date, 'sunday');
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getDate()).toBe(16); // June 16, 2024
  });

  it('should handle Sunday input with Monday week start', () => {
    // Sunday, June 23, 2024
    const date = new Date(2024, 5, 23);
    const result = startOfWeek(date, 'monday');
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(17); // June 17, 2024
  });

  it('should handle Monday input with Monday week start', () => {
    // Monday, June 17, 2024
    const date = new Date(2024, 5, 17);
    const result = startOfWeek(date, 'monday');
    expect(result.getDate()).toBe(17); // Same day
  });

  it('should handle Sunday input with Sunday week start', () => {
    // Sunday, June 16, 2024
    const date = new Date(2024, 5, 16);
    const result = startOfWeek(date, 'sunday');
    expect(result.getDate()).toBe(16); // Same day
  });
});

describe('endOfWeek', () => {
  it('should return Sunday for ISO week (Monday start)', () => {
    const date = new Date(2024, 5, 19);
    const result = endOfWeek(date, 'monday');
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getDate()).toBe(23);
  });

  it('should return Saturday for Sunday week start', () => {
    const date = new Date(2024, 5, 19);
    const result = endOfWeek(date, 'sunday');
    expect(result.getDay()).toBe(6); // Saturday
    expect(result.getDate()).toBe(22);
  });
});

describe('startOfMonth', () => {
  it('should return the first day of the month', () => {
    const date = new Date(2024, 5, 15);
    const result = startOfMonth(date);
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(5);
    expect(result.getHours()).toBe(0);
  });
});

describe('endOfMonth', () => {
  it('should return the last day of June (30 days)', () => {
    const date = new Date(2024, 5, 15);
    const result = endOfMonth(date);
    expect(result.getDate()).toBe(30);
    expect(result.getMonth()).toBe(5);
  });

  it('should return February 29 in leap year', () => {
    const date = new Date(2024, 1, 15); // Feb 2024 (leap year)
    const result = endOfMonth(date);
    expect(result.getDate()).toBe(29);
  });

  it('should return February 28 in non-leap year', () => {
    const date = new Date(2023, 1, 15); // Feb 2023
    const result = endOfMonth(date);
    expect(result.getDate()).toBe(28);
  });

  it('should handle December correctly', () => {
    const date = new Date(2024, 11, 15);
    const result = endOfMonth(date);
    expect(result.getDate()).toBe(31);
    expect(result.getMonth()).toBe(11);
  });
});

describe('startOfYear', () => {
  it('should return January 1st', () => {
    const date = new Date(2024, 5, 15);
    const result = startOfYear(date);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
    expect(result.getFullYear()).toBe(2024);
  });
});

describe('endOfYear', () => {
  it('should return December 31st', () => {
    const date = new Date(2024, 5, 15);
    const result = endOfYear(date);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
    expect(result.getFullYear()).toBe(2024);
  });
});

describe('calculateProgress', () => {
  it('should return 0% when not started', () => {
    const now = new Date(2024, 0, 1);
    const start = new Date(2024, 0, 15);
    const end = new Date(2024, 0, 31);
    const result = calculateProgress(now, start, end);
    expect(result.percent).toBe(0);
    expect(result.status).toBe('not-started');
    expect(result.elapsedMs).toBe(0);
  });

  it('should return 100% when ended', () => {
    const now = new Date(2024, 1, 15);
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 31);
    const result = calculateProgress(now, start, end);
    expect(result.percent).toBe(100);
    expect(result.status).toBe('ended');
    expect(result.remainingMs).toBe(0);
  });

  it('should return 50% at midpoint', () => {
    const start = new Date(2024, 0, 1, 0, 0, 0);
    const end = new Date(2024, 0, 11, 0, 0, 0); // 10 days
    const now = new Date(2024, 0, 6, 0, 0, 0); // 5 days in
    const result = calculateProgress(now, start, end);
    expect(result.percent).toBe(50);
    expect(result.status).toBe('in-progress');
  });

  it('should handle invalid range (end <= start)', () => {
    const now = new Date(2024, 0, 15);
    const start = new Date(2024, 0, 31);
    const end = new Date(2024, 0, 1);
    const result = calculateProgress(now, start, end);
    expect(result.percent).toBe(100);
    expect(result.status).toBe('ended');
  });

  it('should clamp percent between 0 and 100', () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 2);
    const now = new Date(2024, 0, 1, 12, 0, 0);
    const result = calculateProgress(now, start, end);
    expect(result.percent).toBeGreaterThanOrEqual(0);
    expect(result.percent).toBeLessThanOrEqual(100);
  });
});

describe('clamp', () => {
  it('should return min when value is below', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it('should return max when value is above', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('should return value when within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('should handle NaN by returning min', () => {
    expect(clamp(NaN, 0, 100)).toBe(0);
  });
});

describe('getDayProgress', () => {
  it('should return valid progress for middle of day', () => {
    const noon = new Date(2024, 5, 15, 12, 0, 0);
    const result = getDayProgress(noon);
    expect(result.percent).toBeCloseTo(50, 0);
    expect(result.status).toBe('in-progress');
  });

  it('should return ~0% at start of day', () => {
    const midnight = new Date(2024, 5, 15, 0, 0, 1);
    const result = getDayProgress(midnight);
    expect(result.percent).toBeLessThan(1);
  });
});

describe('getWeekProgress', () => {
  it('should return valid progress', () => {
    const wednesday = new Date(2024, 5, 19, 12, 0, 0); // Wednesday
    const result = getWeekProgress(wednesday, 'monday');
    expect(result.percent).toBeGreaterThan(0);
    expect(result.percent).toBeLessThan(100);
    expect(result.status).toBe('in-progress');
  });
});

describe('getMonthProgress', () => {
  it('should return ~50% mid-month', () => {
    const date = new Date(2024, 5, 15, 12, 0, 0); // June 15
    const result = getMonthProgress(date);
    expect(result.percent).toBeCloseTo(50, -1); // Within 10%
  });
});

describe('getYearProgress', () => {
  it('should return ~50% mid-year', () => {
    const date = new Date(2024, 6, 1); // July 1
    const result = getYearProgress(date);
    expect(result.percent).toBeCloseTo(50, -1); // Within 10%
  });
});

describe('formatDuration', () => {
  it('should format seconds', () => {
    expect(formatDuration(5000)).toBe('5s');
  });

  it('should format minutes and seconds', () => {
    expect(formatDuration(125000)).toBe('2m 5s');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(3725000)).toBe('1h 2m');
  });

  it('should format days and hours', () => {
    expect(formatDuration(90000000)).toBe('1d 1h');
  });

  it('should handle 0', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('should handle negative values', () => {
    expect(formatDuration(-1000)).toBe('0s');
  });
});

describe('formatPercent', () => {
  it('should format with default precision (1 decimal)', () => {
    expect(formatPercent(50.5)).toBe('50.5%');
  });

  it('should format with 2 decimals', () => {
    expect(formatPercent(50.5678, 2)).toBe('50.57%');
  });

  it('should format with 3 decimals', () => {
    expect(formatPercent(42.1234, 3)).toBe('42.123%');
  });

  it('should handle 0 with different decimals', () => {
    expect(formatPercent(0, 1)).toBe('0.0%');
    expect(formatPercent(0, 2)).toBe('0.00%');
    expect(formatPercent(0, 3)).toBe('0.000%');
  });

  it('should handle 100 with different decimals', () => {
    expect(formatPercent(100, 1)).toBe('100.0%');
    expect(formatPercent(100, 2)).toBe('100.00%');
    expect(formatPercent(100, 3)).toBe('100.000%');
  });

  it('should round correctly', () => {
    // Note: 50.555 rounds to 50.55 due to floating-point representation
    // Using values that round predictably
    expect(formatPercent(50.556, 2)).toBe('50.56%');
    expect(formatPercent(50.554, 2)).toBe('50.55%');
  });
});

describe('isLeapYear', () => {
  it('should return true for 2024', () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it('should return false for 2023', () => {
    expect(isLeapYear(2023)).toBe(false);
  });

  it('should return false for 1900 (divisible by 100 but not 400)', () => {
    expect(isLeapYear(1900)).toBe(false);
  });

  it('should return true for 2000 (divisible by 400)', () => {
    expect(isLeapYear(2000)).toBe(true);
  });
});

describe('getDaysInMonth', () => {
  it('should return 31 for January', () => {
    expect(getDaysInMonth(2024, 0)).toBe(31);
  });

  it('should return 29 for February in leap year', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29);
  });

  it('should return 28 for February in non-leap year', () => {
    expect(getDaysInMonth(2023, 1)).toBe(28);
  });

  it('should return 30 for June', () => {
    expect(getDaysInMonth(2024, 5)).toBe(30);
  });
});

describe('calculateAge', () => {
  it('should calculate age correctly', () => {
    const birth = new Date(1990, 0, 15);
    const now = new Date(2024, 5, 15);
    expect(calculateAge(birth, now)).toBe(34);
  });

  it('should not count birthday if not yet reached this year', () => {
    const birth = new Date(1990, 11, 15); // December 15
    const now = new Date(2024, 5, 15); // June 15
    expect(calculateAge(birth, now)).toBe(33);
  });

  it('should count birthday if reached this year', () => {
    const birth = new Date(1990, 5, 15); // June 15
    const now = new Date(2024, 5, 16); // June 16
    expect(calculateAge(birth, now)).toBe(34);
  });

  it('should return 0 for future birth date', () => {
    const birth = new Date(2025, 0, 1);
    const now = new Date(2024, 5, 15);
    expect(calculateAge(birth, now)).toBe(0);
  });
});

describe('calculatePreciseAge', () => {
  it('should return decimal age', () => {
    const birth = new Date(1990, 0, 1);
    const now = new Date(2024, 6, 1); // ~34.5 years
    const age = calculatePreciseAge(birth, now);
    expect(age).toBeGreaterThan(34);
    expect(age).toBeLessThan(35);
  });

  it('should return 0 for future birth date', () => {
    const birth = new Date(2025, 0, 1);
    const now = new Date(2024, 5, 15);
    expect(calculatePreciseAge(birth, now)).toBe(0);
  });
});

describe('Edge cases', () => {
  it('should handle year boundary correctly', () => {
    const dec31 = new Date(2024, 11, 31, 23, 59, 59);
    const progress = getYearProgress(dec31);
    expect(progress.percent).toBeCloseTo(100, 0);
  });

  it('should handle month with 31 days', () => {
    const jan31 = new Date(2024, 0, 31, 12, 0);
    const progress = getMonthProgress(jan31);
    expect(progress.status).toBe('in-progress');
  });

  it('should handle February in leap year', () => {
    const feb29 = new Date(2024, 1, 29, 12, 0);
    const progress = getMonthProgress(feb29);
    expect(progress.status).toBe('in-progress');
    expect(progress.percent).toBeGreaterThan(95);
  });
});
