import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Settings } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const updateSettings = useCallback(
    (updates: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [setSettings]
  );

  // Determine actual dark mode state
  const isDarkMode = useActualDarkMode(settings.theme);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  }, [isDarkMode, updateSettings]);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, isDarkMode, toggleDarkMode }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Hook to determine actual dark mode based on theme setting
function useActualDarkMode(theme: Settings['theme']): boolean {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  if (theme === 'system') {
    return prefersDark;
  }

  return theme === 'dark';
}

// Hook to track media query
function useMediaQuery(query: string): boolean {
  const getMatches = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useLocalStorage<boolean>(
    `mq_${query}`,
    getMatches()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    handleChange();

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query, setMatches]);

  return matches;
}
