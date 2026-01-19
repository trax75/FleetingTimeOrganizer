import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import type { PercentDecimals } from '@ultimate-timer/shared';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { useTheme } from '../../src/hooks/useTheme';

type ThemeOption = 'system' | 'light' | 'dark';
type WeekStartOption = 'monday' | 'sunday';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const themePreference = useSettingsStore((state) => state.theme);
  const weekStart = useSettingsStore((state) => state.weekStart);
  const percentDecimals = useSettingsStore((state) => state.percentDecimals);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setWeekStart = useSettingsStore((state) => state.setWeekStart);
  const setPercentDecimals = useSettingsStore((state) => state.setPercentDecimals);
  const resetToDefaults = useTimerStore((state) => state.resetToDefaults);

  const handleResetTimers = () => {
    Alert.alert(
      'Reset Timers',
      'This will remove all custom timers and restore defaults. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetToDefaults,
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Theme */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Theme</Text>
        <View style={styles.buttonGroup}>
          {(['system', 'light', 'dark'] as ThemeOption[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setTheme(option)}
              style={[
                styles.button,
                {
                  backgroundColor:
                    themePreference === option ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: themePreference === option ? '#fff' : theme.text,
                  },
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.hint, { color: theme.textTertiary }]}>
          System follows your device preferences
        </Text>
      </View>

      {/* Week Start */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Week Starts On</Text>
        <View style={styles.buttonGroup}>
          {(['monday', 'sunday'] as WeekStartOption[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setWeekStart(option)}
              style={[
                styles.button,
                {
                  backgroundColor:
                    weekStart === option ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: weekStart === option ? '#fff' : theme.text,
                  },
                ]}
              >
                {option === 'monday' ? 'Monday (ISO)' : 'Sunday'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.hint, { color: theme.textTertiary }]}>
          Affects week progress calculations
        </Text>
      </View>

      {/* Percent Decimals */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Percent Decimals</Text>
        <View style={styles.buttonGroup}>
          {([1, 2, 3] as PercentDecimals[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setPercentDecimals(option)}
              style={[
                styles.button,
                {
                  backgroundColor:
                    percentDecimals === option ? theme.primary : theme.surface,
                  borderColor: theme.border,
                  minWidth: 50,
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: percentDecimals === option ? '#fff' : theme.text,
                  },
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.hint, { color: theme.textTertiary }]}>
          Example: {(42.1234).toFixed(percentDecimals)}%
        </Text>
      </View>

      {/* Reset */}
      <View style={[styles.section, styles.dangerSection]}>
        <Pressable
          onPress={handleResetTimers}
          style={[styles.dangerButton, { borderColor: theme.border }]}
        >
          <Text style={styles.dangerButtonText}>Reset Timers to Defaults</Text>
        </Pressable>
        <Text style={[styles.hint, { color: theme.textTertiary }]}>
          Removes all custom timers and restores default presets
        </Text>
      </View>

      {/* About */}
      <View style={[styles.section, styles.aboutSection]}>
        <Text style={[styles.aboutTitle, { color: theme.text }]}>
          About UltimateTimer
        </Text>
        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          All data is stored locally on your device.
        </Text>
        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          No accounts, no tracking, no servers.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  dangerSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dangerButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  dangerButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  aboutSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 12,
    marginBottom: 2,
  },
});
