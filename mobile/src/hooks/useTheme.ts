import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { lightTheme, darkTheme, type Theme } from '../theme/colors';

export function useTheme(): { theme: Theme; isDark: boolean } {
  const systemColorScheme = useColorScheme();
  const themePreference = useSettingsStore((state) => state.theme);

  let isDark: boolean;

  if (themePreference === 'system') {
    isDark = systemColorScheme === 'dark';
  } else {
    isDark = themePreference === 'dark';
  }

  return {
    theme: isDark ? darkTheme : lightTheme,
    isDark,
  };
}
