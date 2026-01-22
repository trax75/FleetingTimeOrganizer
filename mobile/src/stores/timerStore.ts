import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Timer, TimerMode } from '@ultimate-timer/shared';
import {
  STORAGE_KEYS,
  createMobileDefaultTimers,
  generateId,
} from '@ultimate-timer/shared';
import {
  scheduleTimerNotification,
  cancelTimerNotification,
  scheduleThresholdNotifications,
  cancelThresholdNotifications,
} from '../services/notificationService';

interface TimerStore {
  timers: Timer[];
  initialized: boolean;
  hydrated: boolean;

  // Actions
  initialize: () => void;
  setHydrated: (hydrated: boolean) => void;
  addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => Promise<void>;
  updateTimer: (id: string, updates: Partial<Timer>) => Promise<void>;
  deleteTimer: (id: string) => Promise<void>;
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

      addTimer: async (timerData) => {
        const newTimer: Timer = {
          ...timerData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          kind: 'custom',
          viewMode: timerData.defaultViewMode || timerData.mode,
        };

        // Schedule notifications based on configuration
        if (newTimer.notifications?.enabled && newTimer.notifications.thresholds.length > 0) {
          // Use new threshold-based notifications
          const scheduledIds = await scheduleThresholdNotifications(newTimer);
          if (scheduledIds) {
            newTimer.scheduledNotificationIds = scheduledIds;
          }
        } else if (newTimer.endDate) {
          // Fallback to legacy 100% notification
          const notificationId = await scheduleTimerNotification(newTimer);
          if (notificationId) {
            newTimer.notificationId = notificationId;
          }
        }

        set((state) => ({
          timers: [...state.timers, newTimer],
        }));
      },

      updateTimer: async (id, updates) => {
        const { timers } = get();
        const timer = timers.find((t) => t.id === id);

        if (timer) {
          const updatedTimer = { ...timer, ...updates };
          const needsReschedule =
            updates.endDate !== undefined ||
            updates.startDate !== undefined ||
            updates.notifications !== undefined;

          if (needsReschedule) {
            // Cancel all existing notifications
            if (timer.notificationId) {
              await cancelTimerNotification(timer.notificationId);
              updates.notificationId = undefined;
            }
            if (timer.scheduledNotificationIds) {
              await cancelThresholdNotifications(timer.scheduledNotificationIds);
              updates.scheduledNotificationIds = undefined;
            }

            // Schedule new notifications based on configuration
            if (updatedTimer.notifications?.enabled && updatedTimer.notifications.thresholds.length > 0) {
              const scheduledIds = await scheduleThresholdNotifications(updatedTimer);
              if (scheduledIds) {
                updates.scheduledNotificationIds = scheduledIds;
              }
            } else if (updatedTimer.endDate) {
              // Fallback to legacy 100% notification
              const notificationId = await scheduleTimerNotification(updatedTimer);
              updates.notificationId = notificationId || undefined;
            }
          }
        }

        set((state) => ({
          timers: state.timers.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTimer: async (id) => {
        const { timers } = get();
        const timer = timers.find((t) => t.id === id);

        // Cancel all notifications
        if (timer?.notificationId) {
          await cancelTimerNotification(timer.notificationId);
        }
        if (timer?.scheduledNotificationIds) {
          await cancelThresholdNotifications(timer.scheduledNotificationIds);
        }

        set((state) => ({
          timers: state.timers.filter((t) => t.id !== id),
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
