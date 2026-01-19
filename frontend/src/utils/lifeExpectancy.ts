import type {
  LifeTimerData,
  LifeExpectancyResult,
  LifeTimerProgress,
  Sex,
} from '../types';
import { calculatePreciseAge, clamp } from './timeCalculations';

// Bundled life expectancy data (WHO/World Bank 2023 estimates)
// This data is static and does not require network calls
const LIFE_EXPECTANCY_DATA: Record<string, { name: string; total: number; male: number; female: number }> = {
  DE: { name: 'Germany', total: 81.3, male: 78.8, female: 83.5 },
  AT: { name: 'Austria', total: 81.6, male: 79.2, female: 84.0 },
  CH: { name: 'Switzerland', total: 83.4, male: 81.6, female: 85.2 },
  US: { name: 'United States', total: 77.5, male: 74.8, female: 80.2 },
  GB: { name: 'United Kingdom', total: 81.0, male: 79.0, female: 82.9 },
  FR: { name: 'France', total: 82.5, male: 79.6, female: 85.3 },
  IT: { name: 'Italy', total: 82.9, male: 80.5, female: 85.2 },
  ES: { name: 'Spain', total: 83.3, male: 80.4, female: 86.0 },
  JP: { name: 'Japan', total: 84.3, male: 81.5, female: 87.1 },
  CA: { name: 'Canada', total: 82.0, male: 79.8, female: 84.1 },
  AU: { name: 'Australia', total: 83.0, male: 81.2, female: 84.8 },
  NL: { name: 'Netherlands', total: 81.5, male: 79.8, female: 83.1 },
  BE: { name: 'Belgium', total: 81.4, male: 79.2, female: 83.6 },
  SE: { name: 'Sweden', total: 82.8, male: 81.0, female: 84.5 },
  NO: { name: 'Norway', total: 83.2, male: 81.4, female: 84.9 },
  DK: { name: 'Denmark', total: 81.4, male: 79.6, female: 83.2 },
  FI: { name: 'Finland', total: 81.8, male: 79.2, female: 84.3 },
  PL: { name: 'Poland', total: 76.5, male: 72.6, female: 80.4 },
  CZ: { name: 'Czech Republic', total: 78.7, male: 75.9, female: 81.5 },
  PT: { name: 'Portugal', total: 81.3, male: 78.2, female: 84.1 },
  GR: { name: 'Greece', total: 80.1, male: 77.4, female: 82.8 },
  IE: { name: 'Ireland', total: 82.0, male: 80.0, female: 84.0 },
  NZ: { name: 'New Zealand', total: 82.0, male: 80.0, female: 83.9 },
  KR: { name: 'South Korea', total: 83.6, male: 80.5, female: 86.6 },
  SG: { name: 'Singapore', total: 83.9, male: 81.5, female: 86.1 },
  HK: { name: 'Hong Kong', total: 85.3, male: 82.7, female: 87.9 },
  TW: { name: 'Taiwan', total: 80.9, male: 77.7, female: 84.2 },
  IL: { name: 'Israel', total: 82.8, male: 81.0, female: 84.6 },
  LU: { name: 'Luxembourg', total: 82.7, male: 80.5, female: 84.8 },
  IS: { name: 'Iceland', total: 83.1, male: 81.4, female: 84.7 },
  SK: { name: 'Slovakia', total: 77.0, male: 73.5, female: 80.4 },
  SI: { name: 'Slovenia', total: 81.3, male: 78.5, female: 84.0 },
  EE: { name: 'Estonia', total: 78.6, male: 74.4, female: 82.5 },
  LV: { name: 'Latvia', total: 75.7, male: 70.9, female: 80.0 },
  LT: { name: 'Lithuania', total: 76.0, male: 70.9, female: 80.7 },
  HU: { name: 'Hungary', total: 76.4, male: 73.0, female: 79.6 },
  RO: { name: 'Romania', total: 75.6, male: 72.0, female: 79.1 },
  BG: { name: 'Bulgaria', total: 74.8, male: 71.4, female: 78.2 },
  HR: { name: 'Croatia', total: 78.4, male: 75.1, female: 81.5 },
  RS: { name: 'Serbia', total: 76.0, male: 73.3, female: 78.6 },
  UA: { name: 'Ukraine', total: 73.0, male: 68.0, female: 77.8 },
  RU: { name: 'Russia', total: 72.8, male: 67.6, female: 78.0 },
  TR: { name: 'Turkey', total: 78.0, male: 75.3, female: 80.7 },
  MX: { name: 'Mexico', total: 75.0, male: 72.0, female: 77.9 },
  BR: { name: 'Brazil', total: 75.9, male: 72.4, female: 79.4 },
  AR: { name: 'Argentina', total: 77.1, male: 73.7, female: 80.4 },
  CL: { name: 'Chile', total: 80.2, male: 77.5, female: 82.8 },
  CO: { name: 'Colombia', total: 77.3, male: 74.0, female: 80.4 },
  IN: { name: 'India', total: 70.8, male: 69.5, female: 72.2 },
  CN: { name: 'China', total: 78.2, male: 75.5, female: 81.1 },
  TH: { name: 'Thailand', total: 78.7, male: 74.4, female: 82.7 },
  MY: { name: 'Malaysia', total: 76.0, male: 73.8, female: 78.2 },
  ID: { name: 'Indonesia', total: 71.9, male: 69.9, female: 74.0 },
  PH: { name: 'Philippines', total: 71.2, male: 67.7, female: 74.9 },
  VN: { name: 'Vietnam', total: 75.4, male: 71.0, female: 79.5 },
  ZA: { name: 'South Africa', total: 64.9, male: 61.5, female: 68.0 },
  EG: { name: 'Egypt', total: 72.0, male: 69.6, female: 74.5 },
  NG: { name: 'Nigeria', total: 53.9, male: 52.7, female: 55.2 },
  KE: { name: 'Kenya', total: 66.7, male: 64.0, female: 69.4 },
  SA: { name: 'Saudi Arabia', total: 76.9, male: 75.4, female: 78.8 },
  AE: { name: 'United Arab Emirates', total: 78.0, male: 77.1, female: 79.5 },
  DEFAULT: { name: 'Global Average', total: 73.4, male: 70.8, female: 76.0 },
};

const DATA_SOURCE = 'World Bank / WHO 2023 estimates';

/**
 * Get life expectancy for a country (offline - no network calls)
 */
function getLifeExpectancyValue(countryCode: string, sex: Sex): number {
  const country = LIFE_EXPECTANCY_DATA[countryCode] || LIFE_EXPECTANCY_DATA['DEFAULT']!;

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

  // Chronic condition
  switch (data.chronicCondition) {
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

  // Cap total adjustment at ±10 years
  const cappedAdjustment = clamp(totalAdjustment, -10, 10);

  return {
    adjustment: cappedAdjustment,
    details,
  };
}

/**
 * Calculate complete life expectancy result (synchronous - no network calls)
 */
export function calculateLifeExpectancy(
  data: LifeTimerData
): LifeExpectancyResult {
  const baselineYears = getLifeExpectancyValue(data.country, data.sex);
  const { adjustment } = calculateAdjustments(data);

  const adjustedYears = baselineYears + adjustment;
  const rangeMargin = 4; // ±4 years uncertainty

  return {
    baselineYears,
    adjustedYears,
    rangeMin: adjustedYears - rangeMargin,
    rangeMax: adjustedYears + rangeMargin,
    source: DATA_SOURCE,
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
export const COUNTRIES: Array<{ code: string; name: string }> = Object.entries(LIFE_EXPECTANCY_DATA)
  .filter(([code]) => code !== 'DEFAULT')
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

/**
 * Get default country from browser locale
 */
export function getDefaultCountry(): string {
  try {
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    const countryCode = parts[1]?.toUpperCase() || parts[0]?.toUpperCase();

    if (countryCode && LIFE_EXPECTANCY_DATA[countryCode]) {
      return countryCode;
    }
  } catch {
    // Ignore errors
  }

  return 'DE'; // Default to Germany
}
