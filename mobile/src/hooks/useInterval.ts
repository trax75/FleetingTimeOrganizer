import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useInterval(intervalMs: number): number {
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef(AppState.currentState);

  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Immediately trigger a tick when starting/resuming
    setTick((t) => t + 1);
    
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);
  }, [intervalMs]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Start interval immediately
    startInterval();

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - restart interval and trigger immediate update
        startInterval();
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background - stop interval to save battery
        stopInterval();
      }
      appState.current = nextAppState;
    });

    return () => {
      stopInterval();
      subscription.remove();
    };
  }, [startInterval, stopInterval]);

  return tick;
}
