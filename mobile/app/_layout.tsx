import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View, Alert } from 'react-native';
import { useTimerStore } from '../src/stores/timerStore';
import { useSettingsStore } from '../src/stores/settingsStore';
import { useTheme } from '../src/hooks/useTheme';
import { initializeNotifications } from '../src/services/notificationService';
import {
  getInitialUrl,
  addLinkingListener,
  parseShareUrl,
} from '../src/services/shareService';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme, isDark } = useTheme();
  const initialize = useTimerStore((state) => state.initialize);
  const addTimer = useTimerStore((state) => state.addTimer);
  const timerHydrated = useTimerStore((state) => state.hydrated);
  const settingsHydrated = useSettingsStore((state) => state.hydrated);
  const [appIsReady, setAppIsReady] = useState(false);

  // Handle incoming deep link
  const handleDeepLink = useCallback(
    (url: string) => {
      const timer = parseShareUrl(url);
      if (timer) {
        Alert.alert(
          'Import Timer',
          `Would you like to add "${timer.name}" to your timers?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add',
              onPress: () => {
                addTimer({
                  name: timer.name,
                  type: 'custom',
                  mode: timer.mode,
                  startDate: timer.startDate,
                  endDate: timer.endDate,
                });
              },
            },
          ]
        );
      }
    },
    [addTimer]
  );

  // Initialize timers and notifications on app start
  useEffect(() => {
    initialize();
    initializeNotifications().catch(console.error);
  }, [initialize]);

  // Handle deep links
  useEffect(() => {
    // Check for initial URL (app opened via link)
    getInitialUrl().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for links while app is open
    const subscription = addLinkingListener(({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, [handleDeepLink]);

  // Check if stores are hydrated
  useEffect(() => {
    if (timerHydrated && settingsHydrated) {
      setAppIsReady(true);
    }
  }, [timerHydrated, settingsHydrated]);

  // Hide splash screen when app is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide splash screen with a small delay for smoother transition
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Always render the app content, but hide splash when ready
  // This ensures the app renders immediately with default data
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="timer/add"
          options={{
            title: 'Add Timer',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="timer/[id]"
          options={{
            title: 'Edit Timer',
            presentation: 'modal',
          }}
        />
      </Stack>
    </View>
  );
}
