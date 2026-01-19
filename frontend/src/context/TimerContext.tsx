import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import type { Timer, LifeTimerData, LifeExpectancyResult } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  STORAGE_KEYS,
  createDefaultTimers,
} from '../utils/constants';
import { generateId } from '../utils/timeCalculations';

interface TimerContextValue {
  timers: Timer[];
  addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  resetToDefaults: () => void;

  // Life timer
  lifeTimerData: LifeTimerData | null;
  setLifeTimerData: (data: LifeTimerData | null) => void;
  lifeExpectancyResult: LifeExpectancyResult | null;
  setLifeExpectancyResult: (result: LifeExpectancyResult | null) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useLocalStorage<Timer[]>(
    STORAGE_KEYS.TIMERS,
    createDefaultTimers()
  );

  const [lifeTimerData, setLifeTimerData] = useLocalStorage<LifeTimerData | null>(
    STORAGE_KEYS.LIFE_TIMER,
    null
  );

  const [lifeExpectancyResult, setLifeExpectancyResult] =
    useLocalStorage<LifeExpectancyResult | null>(
      `${STORAGE_KEYS.LIFE_TIMER}_result`,
      null
    );

  const addTimer = useCallback(
    (timer: Omit<Timer, 'id' | 'createdAt'>) => {
      const newTimer: Timer = {
        ...timer,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setTimers((prev) => [...prev, newTimer]);
    },
    [setTimers]
  );

  const updateTimer = useCallback(
    (id: string, updates: Partial<Timer>) => {
      setTimers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    [setTimers]
  );

  const deleteTimer = useCallback(
    (id: string) => {
      setTimers((prev) => prev.filter((t) => t.id !== id));
    },
    [setTimers]
  );

  const resetToDefaults = useCallback(() => {
    setTimers(createDefaultTimers());
  }, [setTimers]);

  return (
    <TimerContext.Provider
      value={{
        timers,
        addTimer,
        updateTimer,
        deleteTimer,
        resetToDefaults,
        lifeTimerData,
        setLifeTimerData,
        lifeExpectancyResult,
        setLifeExpectancyResult,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimers() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
}
