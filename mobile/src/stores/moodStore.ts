import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MoodEntry, MoodRating, TimerType } from '@ultimate-timer/shared';
import { generateId, SCHEMA_VERSION } from '@ultimate-timer/shared';

const STORAGE_KEY = 'fleeting-time-mood';

interface MoodStore {
  version: number;
  entries: MoodEntry[];
  hydrated: boolean;

  // Actions
  setHydrated: (hydrated: boolean) => void;
  addEntry: (timerId: string, timerType: TimerType, rating: MoodRating, note?: string) => string;
  getEntriesForTimer: (timerId: string) => MoodEntry[];
  getRecentEntries: (limit?: number) => MoodEntry[];
  deleteEntry: (id: string) => void;
  clearAll: () => void;
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      version: SCHEMA_VERSION,
      entries: [],
      hydrated: false,

      setHydrated: (hydrated: boolean) => set({ hydrated }),

      addEntry: (timerId, timerType, rating, note) => {
        const id = generateId();
        const newEntry: MoodEntry = {
          id,
          timerId,
          timerType,
          rating,
          note,
          recordedAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [...state.entries, newEntry],
        }));

        return id;
      },

      getEntriesForTimer: (timerId) => {
        return get().entries.filter((entry) => entry.timerId === timerId);
      },

      getRecentEntries: (limit = 10) => {
        return [...get().entries]
          .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
          .slice(0, limit);
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      clearAll: () => {
        set({ entries: [] });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        version: state.version,
        entries: state.entries,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
