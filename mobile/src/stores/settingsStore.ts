import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Settings, PercentDecimals } from '@ultimate-timer/shared';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@ultimate-timer/shared';

interface SettingsStore extends Settings {
  hydrated: boolean;
  // Actions
  setHydrated: (hydrated: boolean) => void;
  setTheme: (theme: Settings['theme']) => void;
  setWeekStart: (weekStart: Settings['weekStart']) => void;
  setPercentDecimals: (decimals: PercentDecimals) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      ...DEFAULT_SETTINGS,
      hydrated: false,

      // Actions
      setHydrated: (hydrated: boolean) => set({ hydrated }),
      setTheme: (theme) => set({ theme }),
      setWeekStart: (weekStart) => set({ weekStart }),
      setPercentDecimals: (percentDecimals) => set({ percentDecimals }),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
