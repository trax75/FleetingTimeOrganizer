import { useState, useEffect, type FormEvent } from 'react';
import type { LifeTimerData, Sex, ChronicCondition } from '../types';
import {
  COUNTRIES,
  getDefaultCountry,
  calculateLifeExpectancy,
  calculateAdjustments,
} from '../utils/lifeExpectancy';
import { LIFE_TIMER_DISCLAIMER, DEFAULT_LIFE_TIMER_DATA } from '../utils/constants';
import { toISODateString } from '../utils/timeCalculations';

interface LifeTimerSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LifeTimerData) => void;
  onClear: () => void;
  existingData: LifeTimerData | null;
}

export function LifeTimerSetup({
  isOpen,
  onClose,
  onSave,
  onClear,
  existingData,
}: LifeTimerSetupProps) {
  const [data, setData] = useState<LifeTimerData>(
    existingData || {
      ...DEFAULT_LIFE_TIMER_DATA,
      country: getDefaultCountry(),
    }
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{
    baseline: number;
    adjusted: number;
    range: string;
  } | null>(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setData(
        existingData || {
          ...DEFAULT_LIFE_TIMER_DATA,
          country: getDefaultCountry(),
        }
      );
      setShowAdvanced(!!existingData?.chronicCondition && existingData.chronicCondition !== 'none');
      setError('');
      setPreview(null);
    }
  }, [isOpen, existingData]);

  // Calculate preview when data changes
  useEffect(() => {
    if (data.birthDate && data.country) {
      calculatePreview();
    }
  }, [data]);

  const calculatePreview = async () => {
    if (!data.birthDate) return;

    setIsLoading(true);
    try {
      const result = await calculateLifeExpectancy(data);
      setPreview({
        baseline: result.baselineYears,
        adjusted: result.adjustedYears,
        range: `${result.rangeMin.toFixed(0)}–${result.rangeMax.toFixed(0)}`,
      });
    } catch (err) {
      console.error('Failed to calculate life expectancy:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data.birthDate) {
      setError('Birth date is required');
      return;
    }

    const birthDate = new Date(data.birthDate);
    if (birthDate > new Date()) {
      setError('Birth date cannot be in the future');
      return;
    }

    onSave(data);
    onClose();
  };

  const updateField = <K extends keyof LifeTimerData>(
    field: K,
    value: LifeTimerData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  if (!isOpen) return null;

  const adjustments = calculateAdjustments(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 z-10 my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="life-modal-title"
      >
        <h2
          id="life-modal-title"
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          Life Timer Setup
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Estimate your life progress based on statistical data and lifestyle factors.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Birth Date */}
          <div>
            <label htmlFor="birth-date" className="label">
              Birth Date *
            </label>
            <input
              id="birth-date"
              type="date"
              value={data.birthDate}
              onChange={(e) => updateField('birthDate', e.target.value)}
              max={toISODateString(new Date())}
              className="input"
              required
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="label">
              Country
            </label>
            <select
              id="country"
              value={data.country}
              onChange={(e) => updateField('country', e.target.value)}
              className="input"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Used for baseline life expectancy data
            </p>
          </div>

          {/* Sex */}
          <div>
            <label className="label">Sex at Birth (optional)</label>
            <div className="flex gap-4 flex-wrap">
              {(['unspecified', 'male', 'female'] as Sex[]).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value={s}
                    checked={data.sex === s}
                    onChange={() => updateField('sex', s)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {s === 'unspecified' ? 'Prefer not to say' : s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Smoking Status */}
          <div>
            <label className="label">Smoking Status</label>
            <div className="flex gap-4 flex-wrap">
              {([
                { value: 'never', label: 'Never smoked' },
                { value: 'former', label: 'Former smoker' },
                { value: 'current', label: 'Current smoker' },
              ] as const).map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="smoking"
                    value={value}
                    checked={data.smokingStatus === value}
                    onChange={() => updateField('smokingStatus', value)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="label">Activity Level</label>
            <div className="flex gap-4 flex-wrap">
              {([
                { value: 'sedentary', label: 'Sedentary' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'active', label: 'Active' },
              ] as const).map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="activity"
                    value={value}
                    checked={data.activityLevel === value}
                    onChange={() => updateField('activityLevel', value)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Family Longevity */}
          <div>
            <label className="label">Did a parent reach age 85+?</label>
            <div className="flex gap-4 flex-wrap">
              {([
                { value: 'unknown', label: "Don't know" },
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ] as const).map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="parent85"
                    value={value}
                    checked={data.parentReached85 === value}
                    onChange={() => updateField('parentReached85', value)}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Advanced: Chronic Condition */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              {showAdvanced ? '− Hide' : '+ Show'} advanced options
            </button>

            {showAdvanced && (
              <div className="mt-3">
                <label className="label">Chronic Health Condition (optional)</label>
                <select
                  value={data.chronicCondition}
                  onChange={(e) =>
                    updateField('chronicCondition', e.target.value as ChronicCondition)
                  }
                  className="input"
                >
                  <option value="none">None</option>
                  <option value="cardiovascular">Cardiovascular disease</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="cancer">Cancer (history)</option>
                  <option value="respiratory">Respiratory condition</option>
                  <option value="other">Other chronic condition</option>
                </select>
              </div>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Estimate Preview
              </h3>
              <div className="text-sm space-y-1">
                <p className="text-gray-600 dark:text-gray-300">
                  Baseline: {preview.baseline.toFixed(1)} years
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Adjusted: <strong>{preview.adjusted.toFixed(1)} years</strong>
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Range: {preview.range} years
                </p>
              </div>

              {adjustments.details.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium mb-1">Adjustments:</p>
                  {adjustments.details.map((d, i) => (
                    <p key={i}>
                      {d.factor}: {d.adjustment > 0 ? '+' : ''}{d.adjustment} years
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-200 whitespace-pre-line">
              {LIFE_TIMER_DISCLAIMER}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <div>
              {existingData && (
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    onClose();
                  }}
                  className="btn-ghost text-red-600 dark:text-red-400"
                >
                  Remove Life Timer
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Calculating...' : existingData ? 'Update' : 'Create Life Timer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
