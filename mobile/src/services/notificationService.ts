import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Timer, NotificationThreshold } from '@ultimate-timer/shared';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Notification channel for Android
const CHANNEL_ID = 'timer-notifications';

/**
 * Initialize notification service (channel setup only)
 * Call this on app startup
 */
export async function initializeNotifications(): Promise<void> {
  // Set up Android notification channel (doesn't require permission)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Timer Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B6B',
      sound: 'default',
    });
  }
}

/**
 * Check if notification permissions are granted
 */
export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/**
 * Request notification permission from user
 * Returns true if granted, false otherwise
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule a notification for when a timer ends (legacy - 100% only)
 */
export async function scheduleTimerNotification(timer: Timer): Promise<string | null> {
  if (!timer.endDate) return null;

  const endTime = new Date(timer.endDate).getTime();
  const now = Date.now();

  // Don't schedule if timer already ended
  if (endTime <= now) return null;

  const secondsUntilEnd = Math.floor((endTime - now) / 1000);

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${timer.name} completed!`,
        body: 'Your timer has reached its end date.',
        data: { timerId: timer.id, timerType: timer.type },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilEnd,
        channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

/**
 * Get notification message for a threshold
 */
function getThresholdMessage(timerName: string, threshold: NotificationThreshold): { title: string; body: string } {
  switch (threshold) {
    case 50:
      return {
        title: `${timerName} - Halfway there!`,
        body: '50% of your timer has elapsed.',
      };
    case 80:
      return {
        title: `${timerName} - Almost done!`,
        body: '80% of your timer has elapsed. Only 20% remaining!',
      };
    case 100:
      return {
        title: `${timerName} completed!`,
        body: 'Your timer has reached its end date.',
      };
  }
}

/**
 * Schedule notifications for configured thresholds
 * Returns a map of threshold -> notificationId
 */
export async function scheduleThresholdNotifications(
  timer: Timer
): Promise<Record<NotificationThreshold, string> | null> {
  if (!timer.startDate || !timer.endDate) return null;
  if (!timer.notifications?.enabled || !timer.notifications.thresholds.length) return null;

  const startTime = new Date(timer.startDate).getTime();
  const endTime = new Date(timer.endDate).getTime();
  const now = Date.now();
  const totalMs = endTime - startTime;

  if (totalMs <= 0) return null;

  const results: Record<number, string> = {};

  for (const threshold of timer.notifications.thresholds) {
    // Calculate when this threshold will be reached
    const thresholdMs = startTime + (totalMs * threshold) / 100;
    const secondsUntilThreshold = Math.floor((thresholdMs - now) / 1000);

    // Skip if threshold already passed
    if (secondsUntilThreshold <= 0) continue;

    const { title, body } = getThresholdMessage(timer.name, threshold);

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { timerId: timer.id, timerType: timer.type, threshold },
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilThreshold,
          channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
        },
      });

      results[threshold] = identifier;
    } catch (error) {
      console.error(`Failed to schedule ${threshold}% notification:`, error);
    }
  }

  return Object.keys(results).length > 0 ? results as Record<NotificationThreshold, string> : null;
}

/**
 * Cancel all threshold notifications for a timer
 */
export async function cancelThresholdNotifications(
  notificationIds: Record<NotificationThreshold, string> | undefined
): Promise<void> {
  if (!notificationIds) return;

  for (const id of Object.values(notificationIds)) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelTimerNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Add listener for notification received while app is in foreground
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add listener for notification response (user tapped on notification)
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Show an immediate local notification
 */
export async function showLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
    },
    trigger: null, // Immediate
  });
}
