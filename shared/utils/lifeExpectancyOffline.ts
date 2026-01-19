import type {
  LifeTimerData,
  LifeExpectancyResult,
  LifeTimerProgress,
  Sex,
} from '../types/index';
import { calculatePreciseAge, clamp } from './timeCalculations';
import lifeExpectancyData from '../data/lifeExpectancy.json';

interface CountryData {
  name: string;
  nameLocal: string;
  total: number;
  male: number;
  female: number;
}

interface LifeExpectancyDataset {
  source: string;
  generatedAt: string;
  note: string;
  countries: Record<string, CountryData>;
}

const dataset = lifeExpectancyData as LifeExpectancyDataset;

/**
 * Get offline life expectancy for a country and sex
 * Uses bundled JSON data - no network calls
 */
export function getOfflineLifeExpectancy(
  countryCode: string,
  sex: Sex
): { value: number; source: string } {
  const country = dataset.countries[countryCode] || dataset.countries['DEFAULT'];

  if (!country) {
    // Fallback to global average
    return {
      value: 73.4,
      source: 'Global average (fallback)',
    };
  }

  let value: number;
  switch (sex) {
    case 'male':
      value = country.male;
      break;
    case 'female':
      value = country.female;
      break;
    default:
      value = country.total;
  }

  return {
    value,
    source: dataset.source,
  };
}

/**
 * Calculate life expectancy adjustments based on lifestyle factors
 * Same logic as the original, but exported for offline use
 */
export function calculateAdjustmentsOffline(data: LifeTimerData): {
  adjustment: number;
  details: Array<{ factor: string; adjustment: number }>;
} {
  const details: Array<{ factor: string; adjustment: number }> = [];
  let totalAdjustment = 0;

  // Smoking status
  switch (data.smokingStatus) {
    case 'current':
      details.push({ factor: 'Current smoker', adjustment: -6 });
      totalAdjustment -= 6;
      break;
    case 'former':
      details.push({ factor: 'Former smoker', adjustment: -2 });
      totalAdjustment -= 2;
      break;
  }

  // Activity level
  switch (data.activityLevel) {
    case 'active':
      details.push({ factor: 'Active lifestyle', adjustment: 3 });
      totalAdjustment += 3;
      break;
    case 'moderate':
      details.push({ factor: 'Moderate activity', adjustment: 1.5 });
      totalAdjustment += 1.5;
      break;
    case 'sedentary':
      details.push({ factor: 'Sedentary lifestyle', adjustment: -1 });
      totalAdjustment -= 1;
      break;
  }

  // Family longevity
  if (data.parentReached85 === 'yes') {
    details.push({ factor: 'Parent reached 85+', adjustment: 2 });
    totalAdjustment += 2;
  }

  // Chronic conditions (supports array for multiple conditions)
  // Backward compatible: handle old single value or new array
  const conditions: string[] = Array.isArray(data.chronicConditions)
    ? data.chronicConditions
    : (data as any).chronicCondition
      ? [(data as any).chronicCondition]
      : [];

  for (const condition of conditions) {
    if (condition === 'none') continue;
    switch (condition) {
      case 'cardiovascular':
        details.push({ factor: 'Cardiovascular condition', adjustment: -4 });
        totalAdjustment -= 4;
        break;
      case 'diabetes':
        details.push({ factor: 'Diabetes', adjustment: -3 });
        totalAdjustment -= 3;
        break;
      case 'cancer':
        details.push({ factor: 'Cancer history', adjustment: -4 });
        totalAdjustment -= 4;
        break;
      case 'respiratory':
        details.push({ factor: 'Respiratory condition', adjustment: -3 });
        totalAdjustment -= 3;
        break;
      case 'other':
        details.push({ factor: 'Other chronic condition', adjustment: -2 });
        totalAdjustment -= 2;
        break;
    }
  }

  // Cap total adjustment at ±10 years
  const cappedAdjustment = clamp(totalAdjustment, -10, 10);

  return {
    adjustment: cappedAdjustment,
    details,
  };
}

/**
 * Calculate complete life expectancy result (offline)
 * No network calls - uses bundled data
 */
export function calculateLifeExpectancyOffline(
  data: LifeTimerData
): LifeExpectancyResult {
  const { value: baselineYears, source } = getOfflineLifeExpectancy(
    data.country,
    data.sex
  );

  const { adjustment } = calculateAdjustmentsOffline(data);

  const adjustedYears = baselineYears + adjustment;
  const rangeMargin = 4; // ±4 years uncertainty

  return {
    baselineYears,
    adjustedYears,
    rangeMin: adjustedYears - rangeMargin,
    rangeMax: adjustedYears + rangeMargin,
    source,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Calculate life timer progress (same as original)
 */
export function calculateLifeTimerProgressOffline(
  birthDate: Date,
  estimatedLifespan: number,
  rangeMin: number,
  rangeMax: number,
  now: Date = new Date()
): LifeTimerProgress {
  const yearsLived = calculatePreciseAge(birthDate, now);
  const yearsRemaining = Math.max(0, estimatedLifespan - yearsLived);

  const percent = clamp((yearsLived / estimatedLifespan) * 100, 0, 100);

  // Calculate remaining time breakdown
  const remainingMs = yearsRemaining * 365.25 * 24 * 60 * 60 * 1000;
  const daysRemaining = Math.floor(yearsRemaining * 365.25);
  const monthsRemaining = Math.floor(yearsRemaining * 12);

  return {
    percent,
    elapsedMs: yearsLived * 365.25 * 24 * 60 * 60 * 1000,
    remainingMs,
    totalMs: estimatedLifespan * 365.25 * 24 * 60 * 60 * 1000,
    status: percent >= 100 ? 'ended' : 'in-progress',
    estimatedLifespan,
    rangeMin,
    rangeMax,
    yearsLived,
    yearsRemaining,
    monthsRemaining,
    daysRemaining,
  };
}

/**
 * List of countries from bundled data
 */
export function getCountriesOffline(): Array<{ code: string; name: string; nameLocal: string }> {
  return Object.entries(dataset.countries)
    .filter(([code]) => code !== 'DEFAULT')
    .map(([code, data]) => ({
      code,
      name: data.name,
      nameLocal: data.nameLocal,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get default country from locale (no network)
 */
export function getDefaultCountryOffline(locale?: string): string {
  try {
    const localeStr = locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
    const parts = localeStr.split('-');
    const countryCode = parts[1]?.toUpperCase() || parts[0]?.toUpperCase();

    if (countryCode && dataset.countries[countryCode]) {
      return countryCode;
    }
  } catch {
    // Ignore errors
  }

  return 'DE'; // Default to Germany
}
