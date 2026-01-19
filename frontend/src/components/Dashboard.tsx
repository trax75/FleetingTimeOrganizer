import { useState, useEffect, useMemo } from 'react';
import type { Timer, LifeTimerProgress } from '../types';
import { TimerCard } from './TimerCard';
import { LifeTimerCard } from './LifeTimerCard';
import { AddTimerModal } from './AddTimerModal';
import { LifeTimerSetup } from './LifeTimerSetup';
import { useTimers } from '../context/TimerContext';
import { useSettings } from '../context/SettingsContext';
import { getTimerProgress, useInterval } from '../hooks/useTimer';
import {
  calculateLifeExpectancy,
  calculateLifeTimerProgress,
} from '../utils/lifeExpectancy';
import { TIMER_UPDATE_INTERVAL } from '../utils/constants';

export function Dashboard() {
  const {
    timers,
    addTimer,
    updateTimer,
    deleteTimer,
    lifeTimerData,
    setLifeTimerData,
    lifeExpectancyResult,
    setLifeExpectancyResult,
  } = useTimers();

  const { settings } = useSettings();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLifeModalOpen, setIsLifeModalOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null);

  // Force re-render for progress updates
  const tick = useInterval(TIMER_UPDATE_INTERVAL);

  // Calculate life timer progress
  const [lifeProgress, setLifeProgress] = useState<LifeTimerProgress | null>(null);

  // Calculate life expectancy on data change (synchronous - no network calls)
  useEffect(() => {
    if (lifeTimerData?.birthDate) {
      const result = calculateLifeExpectancy(lifeTimerData);
      setLifeExpectancyResult(result);
    }
  }, [lifeTimerData, setLifeExpectancyResult]);

  // Update life progress
  useEffect(() => {
    if (lifeTimerData?.birthDate && lifeExpectancyResult) {
      const progress = calculateLifeTimerProgress(
        new Date(lifeTimerData.birthDate),
        lifeExpectancyResult.adjustedYears,
        lifeExpectancyResult.rangeMin,
        lifeExpectancyResult.rangeMax
      );
      setLifeProgress(progress);
    } else {
      setLifeProgress(null);
    }
  }, [lifeTimerData, lifeExpectancyResult, tick]);

  // Calculate progress for all timers
  const timerProgresses = useMemo(() => {
    return timers.map((timer) => ({
      timer,
      progress: getTimerProgress(timer, settings.weekStart),
    }));
  }, [timers, settings.weekStart, tick]);

  const handleEditTimer = (timer: Timer) => {
    setEditingTimer(timer);
    setIsAddModalOpen(true);
  };

  const handleDeleteTimer = (id: string) => {
    if (confirm('Delete this timer?')) {
      deleteTimer(id);
    }
  };

  const handleSaveTimer = (timerData: Omit<Timer, 'id' | 'createdAt'>) => {
    if (editingTimer) {
      updateTimer(editingTimer.id, timerData);
      setEditingTimer(null);
    } else {
      addTimer(timerData);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingTimer(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Action bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon />
          Add Custom Timer
        </button>

        {!lifeTimerData && (
          <button
            onClick={() => setIsLifeModalOpen(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <HeartIcon />
            Setup Life Timer
          </button>
        )}
      </div>

      {/* Timer grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Life timer cards */}
        {lifeProgress && (
          <>
            <LifeTimerCard
              progress={lifeProgress}
              mode="elapsed"
              percentDecimals={settings.percentDecimals}
              onEdit={() => setIsLifeModalOpen(true)}
            />
            <LifeTimerCard
              progress={lifeProgress}
              mode="remaining"
              percentDecimals={settings.percentDecimals}
              onEdit={() => setIsLifeModalOpen(true)}
            />
          </>
        )}

        {/* Regular timer cards */}
        {timerProgresses.map(({ timer, progress }) => (
          <TimerCard
            key={timer.id}
            timer={timer}
            progress={progress}
            percentDecimals={settings.percentDecimals}
            onEdit={timer.type === 'custom' ? handleEditTimer : undefined}
            onDelete={handleDeleteTimer}
          />
        ))}
      </div>

      {/* Empty state */}
      {timers.length === 0 && !lifeTimerData && (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <ClockIcon />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No timers yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add custom timers or set up your life timer to get started.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              Add Timer
            </button>
            <button
              onClick={() => setIsLifeModalOpen(true)}
              className="btn-secondary"
            >
              Setup Life Timer
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddTimerModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveTimer}
        editTimer={editingTimer}
      />

      <LifeTimerSetup
        isOpen={isLifeModalOpen}
        onClose={() => setIsLifeModalOpen(false)}
        onSave={setLifeTimerData}
        onClear={() => {
          setLifeTimerData(null);
          setLifeExpectancyResult(null);
        }}
        existingData={lifeTimerData}
      />
    </main>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
