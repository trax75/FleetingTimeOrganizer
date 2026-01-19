import type { Settings as SettingsType, WeekStart, PercentDecimals } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onUpdate: (updates: Partial<SettingsType>) => void;
  onResetTimers: () => void;
}

export function Settings({
  isOpen,
  onClose,
  settings,
  onUpdate,
  onResetTimers,
}: SettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <h2
          id="settings-title"
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
        >
          Settings
        </h2>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="label">Theme</label>
            <div className="flex gap-2">
              {(['system', 'light', 'dark'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onUpdate({ theme })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    settings.theme === theme
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              System follows your device preferences
            </p>
          </div>

          {/* Week Start */}
          <div>
            <label className="label">Week Starts On</label>
            <div className="flex gap-2">
              {(['monday', 'sunday'] as WeekStart[]).map((day) => (
                <button
                  key={day}
                  onClick={() => onUpdate({ weekStart: day })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    settings.weekStart === day
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {day === 'monday' ? 'Monday (ISO)' : 'Sunday'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Affects week progress calculations
            </p>
          </div>

          {/* Percent Decimals */}
          <div>
            <label className="label">Percent Decimals</label>
            <div className="flex gap-2">
              {([1, 2, 3] as PercentDecimals[]).map((decimals) => (
                <button
                  key={decimals}
                  onClick={() => onUpdate({ percentDecimals: decimals })}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    settings.percentDecimals === decimals
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {decimals}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Example: {(42.1234).toFixed(settings.percentDecimals || 1)}%
            </p>
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (confirm('Reset all timers to defaults? Custom timers will be removed.')) {
                  onResetTimers();
                }
              }}
              className="btn-ghost text-red-600 dark:text-red-400"
            >
              Reset Timers to Defaults
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Removes all custom timers and restores default presets
            </p>
          </div>

          {/* About */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              About UltimateTimer
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Version 1.0.0</p>
              <p>All data is stored locally in your browser.</p>
              <p>No accounts, no tracking, no servers.</p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
