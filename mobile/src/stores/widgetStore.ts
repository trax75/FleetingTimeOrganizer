import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetConfig, WidgetSize } from '@ultimate-timer/shared';
import { generateId, SCHEMA_VERSION } from '@ultimate-timer/shared';

const STORAGE_KEY = 'fleeting-time-widgets';

interface WidgetStore {
  version: number;
  configs: WidgetConfig[];
  hydrated: boolean;

  // Actions
  setHydrated: (hydrated: boolean) => void;
  addWidget: (
    timerId: string,
    timerType: 'timer' | 'life',
    size?: WidgetSize
  ) => string;
  updateWidget: (id: string, updates: Partial<Omit<WidgetConfig, 'id' | 'createdAt'>>) => void;
  removeWidget: (id: string) => void;
  getWidgetForTimer: (timerId: string) => WidgetConfig | undefined;
  getAllWidgets: () => WidgetConfig[];
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      version: SCHEMA_VERSION,
      configs: [],
      hydrated: false,

      setHydrated: (hydrated: boolean) => set({ hydrated }),

      addWidget: (timerId, timerType, size = '2x1') => {
        const id = generateId();
        const newConfig: WidgetConfig = {
          id,
          timerId,
          timerType,
          size,
          showPercentage: true,
          showTimeRemaining: true,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          configs: [...state.configs, newConfig],
        }));

        return id;
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          configs: state.configs.map((config) =>
            config.id === id ? { ...config, ...updates } : config
          ),
        }));
      },

      removeWidget: (id) => {
        set((state) => ({
          configs: state.configs.filter((config) => config.id !== id),
        }));
      },

      getWidgetForTimer: (timerId) => {
        return get().configs.find((config) => config.timerId === timerId);
      },

      getAllWidgets: () => {
        return get().configs;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        version: state.version,
        configs: state.configs,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
