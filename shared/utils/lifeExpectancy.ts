import type {
  LifeTimerData,
  LifeExpectancyResult,
  LifeTimerProgress,
  WorldBankCacheEntry,
  Sex,
} from '../types';
import { calculatePreciseAge, clamp } from './timeCalculations';

const CACHE_KEY = 'life_expectancy_cache';
const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// World Bank API indicators
const INDICATORS = {
  total: 'SP.DYN.LE00.IN',
  male: 'SP.DYN.LE00.MA.IN',
  female: 'SP.DYN.LE00.FE.IN',
};

// Fallback life expectancy data (WHO 2023 estimates)
const FALLBACK_DATA: Record<string, { total: number; male: number; female: number }> = {
  DE: { total: 81.3, male: 78.8, female: 83.5 },
  AT: { total: 81.6, male: 79.2, female: 84.0 },
  CH: { total: 83.4, male: 81.6, female: 85.2 },
  US: { total: 77.5, male: 74.8, female: 80.2 },
  GB: { total: 81.0, male: 79.0, female: 82.9 },
  FR: { total: 82.5, male: 79.6, female: 85.3 },
  IT: { total: 82.9, male: 80.5, female: 85.2 },
  ES: { total: 83.3, male: 80.4, female: 86.0 },
  JP: { total: 84.3, male: 81.5, female: 87.1 },
  CA: { total: 82.0, male: 79.8, female: 84.1 },
  AU: { total: 83.0, male: 81.2, female: 84.8 },
  NL: { total: 81.5, male: 79.8, female: 83.1 },
  BE: { total: 81.4, male: 79.2, female: 83.6 },
  SE: { total: 82.8, male: 81.0, female: 84.5 },
  NO: { total: 83.2, male: 81.4, female: 84.9 },
  DK: { total: 81.4, male: 79.6, female: 83.2 },
  FI: { total: 81.8, male: 79.2, female: 84.3 },
  PL: { total: 76.5, male: 72.6, female: 80.4 },
  CZ: { total: 78.7, male: 75.9, female: 81.5 },
  PT: { total: 81.3, male: 78.2, female: 84.1 },
  GR: { total: 80.1, male: 77.4, female: 82.8 },
  // Global average as default
  DEFAULT: { total: 73.4, male: 70.8, female: 76.0 },
};

/**
 * Get cached life expectancy data
 */
function getCachedData(): WorldBankCacheEntry | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const entry: WorldBankCacheEntry = JSON.parse(cached);
    const age = Date.now() - new Date(entry.fetchedAt).getTime();

    if (age > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

/**
 * Cache life expectancy data
 */
function setCachedData(data: Record<string, number>): void {
  const entry: WorldBankCacheEntry = {
    data,
    fetchedAt: new Date().toISOString(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
}

/**
 * Fetch life expectancy from World Bank API
 */
async function fetchWorldBankData(
  countryCode: string,
  sex: Sex
): Promise<number | null> {
  const indicator = sex === 'male' ? INDICATORS.male :
                    sex === 'female' ? INDICATORS.female :
                    INDICATORS.total;

  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&date=2020:2023&per_page=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    // World Bank API returns [metadata, data] array
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
      return null;
    }

    // Find the most recent non-null value
    const entries = data[1] as Array<{ value: number | null; date: string }>;
    for (const entry of entries) {
      if (entry.value !== null) {
        return entry.value;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get fallback life expectancy for a country
 */
function getFallbackValue(countryCode: string, sex: Sex): number {
  const country = FALLBACK_DATA[countryCode] || FALLBACK_DATA['DEFAULT']!;

  switch (sex) {
    case 'male':
      return country.male;
    case 'female':
      return country.female;
    default:
      return country.total;
  }
}

/**
 * Fetch or get cached life expectancy
 */
export async function getLifeExpectancy(
  countryCode: string,
  sex: Sex
): Promise<{ value: number; source: string; fromCache: boolean }> {
  // Check cache first
  const cacheKey = `${countryCode}_${sex}`;
  const cached = getCachedData();

  if (cached && cached.data[cacheKey] !== undefined) {
    return {
      value: cached.data[cacheKey]!,
      source: 'World Bank (cached)',
      fromCache: true,
    };
  }

  // Try to fetch from API
  const apiValue = await fetchWorldBankData(countryCode, sex);

  if (apiValue !== null) {
    // Update cache
    const existingCache = getCachedData();
    const data = existingCache?.data || {};
    data[cacheKey] = apiValue;
    setCachedData(data);

    return {
      value: apiValue,
      source: 'World Bank API',
      fromCache: false,
    };
  }

  // Use fallback
  return {
    value: getFallbackValue(countryCode, sex),
    source: 'Estimated (offline fallback)',
    fromCache: false,
  };
}

/**
 * Calculate life expectancy adjustments based on lifestyle factors
 */
export function calculateAdjustments(data: LifeTimerData): {
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
    // 'never' has no adjustment
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

  // Chronic conditions (can have multiple)
  for (const condition of data.chronicConditions) {
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
        details.push({ factor: 'Chronic condition', adjustment: -2 });
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
 * Calculate complete life expectancy result
 */
export async function calculateLifeExpectancy(
  data: LifeTimerData
): Promise<LifeExpectancyResult> {
  const { value: baselineYears, source } = await getLifeExpectancy(
    data.country,
    data.sex
  );

  const { adjustment } = calculateAdjustments(data);

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
 * Calculate life timer progress
 */
export function calculateLifeTimerProgress(
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
 * List of countries with their names for the selector
 */
export const COUNTRIES: Array<{ code: string; name: string }> = [
  { code: 'DE', name: 'Germany / Deutschland' },
  { code: 'AT', name: 'Austria / Österreich' },
  { code: 'CH', name: 'Switzerland / Schweiz' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
];

/**
 * Get default country from browser locale
 */
export function getDefaultCountry(): string {
  try {
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    const countryCode = parts[1]?.toUpperCase() || parts[0]?.toUpperCase();

    if (countryCode && COUNTRIES.some(c => c.code === countryCode)) {
      return countryCode;
    }
  } catch {
    // Ignore errors
  }

  return 'DE'; // Default to Germany
}
