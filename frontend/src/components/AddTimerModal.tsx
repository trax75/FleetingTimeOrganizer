import { useState, useEffect, type FormEvent } from 'react';
import type { Timer, TimerMode, TimerType } from '../types';
import { toLocalDateTimeString } from '../utils/timeCalculations';

interface AddTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timer: Omit<Timer, 'id' | 'createdAt'>) => void;
  editTimer?: Timer | null;
}

export function AddTimerModal({
  isOpen,
  onClose,
  onSave,
  editTimer,
}: AddTimerModalProps) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<TimerMode>('elapsed');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Reset form when opening or editing
  useEffect(() => {
    if (isOpen) {
      if (editTimer) {
        setName(editTimer.name);
        setMode(editTimer.mode);
        setStartDate(editTimer.startDate || '');
        setEndDate(editTimer.endDate || '');
      } else {
        // Default: start now, end in 1 hour
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        setName('');
        setMode('elapsed');
        setStartDate(toLocalDateTimeString(now));
        setEndDate(toLocalDateTimeString(oneHourLater));
      }
      setError('');
    }
  }, [isOpen, editTimer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!startDate || !endDate) {
      setError('Start and end dates are required');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    onSave({
      name: name.trim(),
      type: 'custom' as TimerType,
      mode,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    onClose();
  };

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
        aria-labelledby="modal-title"
      >
        <h2
          id="modal-title"
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
        >
          {editTimer ? 'Edit Timer' : 'Add Custom Timer'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="timer-name" className="label">
              Name
            </label>
            <input
              id="timer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., Holiday Countdown"
              autoFocus
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start-date" className="label">
              Start Date & Time
            </label>
            <input
              id="start-date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end-date" className="label">
              End Date & Time
            </label>
            <input
              id="end-date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="label">Display Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="elapsed"
                  checked={mode === 'elapsed'}
                  onChange={() => setMode('elapsed')}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Elapsed
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="remaining"
                  checked={mode === 'remaining'}
                  onChange={() => setMode('remaining')}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Remaining
                </span>
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editTimer ? 'Save Changes' : 'Add Timer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
