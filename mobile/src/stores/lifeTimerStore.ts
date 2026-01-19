import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LifeTimer, LifeTimerData, LifeExpectancyResult } from '@ultimate-timer/shared';
import { STORAGE_KEYS, generateId } from '@ultimate-timer/shared';

interface LifeTimerStore {
  lifeTimers: LifeTimer[];
  hydrated: boolean;

  // Actions
  setHydrated: (hydrated: boolean) => void;
  addLifeTimer: (name: string, data: LifeTimerData, result: LifeExpectancyResult) => string;
  updateLifeTimer: (id: string, updates: Partial<Pick<LifeTimer, 'name' | 'data' | 'result'>>) => void;
  removeLifeTimer: (id: string) => void;
  getLifeTimer: (id: string) => LifeTimer | undefined;

  // Legacy compatibility (for migration)
  lifeTimerData: LifeTimerData | null;
  lifeExpectancyResult: LifeExpectancyResult | null;
  setLifeTimerData: (data: LifeTimerData | null) => void;
  setLifeExpectancyResult: (result: LifeExpectancyResult | null) => void;
  clear: () => void;
}

export const useLifeTimerStore = create<LifeTimerStore>()(
  persist(
    (set, get) => ({
      lifeTimers: [],
      hydrated: false,

      setHydrated: (hydrated: boolean) => set({ hydrated }),

      // New multi-timer actions
      addLifeTimer: (name, data, result) => {
        const id = generateId();
        const newTimer: LifeTimer = {
          id,
          name,
          data,
          result,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          lifeTimers: [...state.lifeTimers, newTimer],
        }));
        return id;
      },

      updateLifeTimer: (id, updates) => {
        set((state) => ({
          lifeTimers: state.lifeTimers.map((timer) =>
            timer.id === id
              ? {
                  ...timer,
                  ...(updates.name !== undefined && { name: updates.name }),
                  ...(updates.data !== undefined && { data: updates.data }),
                  ...(updates.result !== undefined && { result: updates.result }),
                }
              : timer
          ),
        }));
      },

      removeLifeTimer: (id) => {
        set((state) => ({
          lifeTimers: state.lifeTimers.filter((timer) => timer.id !== id),
        }));
      },

      getLifeTimer: (id) => {
        return get().lifeTimers.find((timer) => timer.id === id);
      },

      // Legacy single-timer fields (backward compatibility)
      lifeTimerData: null,
      lifeExpectancyResult: null,

      setLifeTimerData: (lifeTimerData) => set({ lifeTimerData }),
      setLifeExpectancyResult: (lifeExpectancyResult) =>
        set({ lifeExpectancyResult }),
      clear: () =>
        set({
          lifeTimerData: null,
          lifeExpectancyResult: null,
        }),
    }),
    {
      name: STORAGE_KEYS.LIFE_TIMER,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
