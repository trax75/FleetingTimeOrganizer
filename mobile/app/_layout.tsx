import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useTimerStore } from '../src/stores/timerStore';
import { useSettingsStore } from '../src/stores/settingsStore';
import { useTheme } from '../src/hooks/useTheme';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme, isDark } = useTheme();
  const initialize = useTimerStore((state) => state.initialize);
  const timerHydrated = useTimerStore((state) => state.hydrated);
  const settingsHydrated = useSettingsStore((state) => state.hydrated);
  const [appIsReady, setAppIsReady] = useState(false);

  // Initialize timers on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

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
