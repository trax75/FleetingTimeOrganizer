import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Timer, TimerMode } from '@ultimate-timer/shared';
import {
  STORAGE_KEYS,
  createMobileDefaultTimers,
  generateId,
} from '@ultimate-timer/shared';

interface TimerStore {
  timers: Timer[];
  initialized: boolean;
  hydrated: boolean;

  // Actions
  initialize: () => void;
  setHydrated: (hydrated: boolean) => void;
  addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  toggleViewMode: (id: string) => void;
  resetToDefaults: () => void;
}

// Create default timers immediately for fast initial render
const defaultTimers = createMobileDefaultTimers();

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Start with default timers for immediate display
      timers: defaultTimers,
      initialized: false,
      hydrated: false,

      setHydrated: (hydrated: boolean) => set({ hydrated }),

      initialize: () => {
        const { timers, initialized } = get();
        if (initialized) return;

        if (timers.length === 0) {
          // First launch - create default timers
          set({
            timers: createMobileDefaultTimers(),
            initialized: true,
          });
        } else {
          // Already has timers - just mark as initialized
          set({ initialized: true });
        }
      },

      addTimer: (timerData) => {
        const newTimer: Timer = {
          ...timerData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          kind: 'custom',
          viewMode: timerData.defaultViewMode || timerData.mode,
        };

        set((state) => ({
          timers: [...state.timers, newTimer],
        }));
      },

      updateTimer: (id, updates) => {
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === id ? { ...timer, ...updates } : timer
          ),
        }));
      },

      deleteTimer: (id) => {
        set((state) => ({
          timers: state.timers.filter((timer) => timer.id !== id),
        }));
      },

      toggleViewMode: (id) => {
        set((state) => ({
          timers: state.timers.map((timer) => {
            if (timer.id !== id) return timer;

            const currentMode = timer.viewMode || timer.mode;
            const newMode: TimerMode =
              currentMode === 'elapsed' ? 'remaining' : 'elapsed';

            return { ...timer, viewMode: newMode };
          }),
        }));
      },

      resetToDefaults: () => {
        set({
          timers: createMobileDefaultTimers(),
        });
      },
    }),
    {
      name: STORAGE_KEYS.TIMERS,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        timers: state.timers,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after hydration is complete
        state?.setHydrated(true);
      },
    }
  )
);
