import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import type { TimerMode } from '@ultimate-timer/shared';
import { useTimerStore } from '../../src/stores/timerStore';
import { useTheme } from '../../src/hooks/useTheme';

// Format date for display
function formatDateForDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Format time for display
function formatTimeForDisplay(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Parse date from DD.MM.YYYY format
function parseDateText(text: string): Date | null {
  const parts = text.split('.');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 1900 || year > 2100) return null;
  if (month < 0 || month > 11) return null;
  if (day < 1 || day > 31) return null;
  const date = new Date(year, month, day);
  if (date.getMonth() !== month) return null;
  return date;
}

// Parse time from HH:MM format
function parseTimeText(text: string): { hours: number; minutes: number } | null {
  const parts = text.split(':');
  if (parts.length !== 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export default function AddTimerScreen() {
  const { theme, isDark } = useTheme();
  const addTimer = useTimerStore((state) => state.addTimer);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [mode, setMode] = useState<TimerMode>('remaining');

  // Text inputs for manual entry
  const [startDateText, setStartDateText] = useState(formatDateForDisplay(new Date()));
  const [startTimeText, setStartTimeText] = useState(formatTimeForDisplay(new Date()));
  const [endDateText, setEndDateText] = useState(formatDateForDisplay(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));
  const [endTimeText, setEndTimeText] = useState(formatTimeForDisplay(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));

  // Picker visibility states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Sync text fields from date
  const syncStartTexts = (date: Date) => {
    setStartDateText(formatDateForDisplay(date));
    setStartTimeText(formatTimeForDisplay(date));
  };

  const syncEndTexts = (date: Date) => {
    setEndDateText(formatDateForDisplay(date));
    setEndTimeText(formatTimeForDisplay(date));
  };

  // Handle text input changes
  const handleStartDateTextChange = (text: string) => {
    setStartDateText(text);
    const parsed = parseDateText(text);
    if (parsed) {
      const newDate = new Date(startDate);
      newDate.setFullYear(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      setStartDate(newDate);
    }
  };

  const handleStartTimeTextChange = (text: string) => {
    setStartTimeText(text);
    const parsed = parseTimeText(text);
    if (parsed) {
      const newDate = new Date(startDate);
      newDate.setHours(parsed.hours, parsed.minutes);
      setStartDate(newDate);
    }
  };

  const handleEndDateTextChange = (text: string) => {
    setEndDateText(text);
    const parsed = parseDateText(text);
    if (parsed) {
      const newDate = new Date(endDate);
      newDate.setFullYear(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      setEndDate(newDate);
    }
  };

  const handleEndTimeTextChange = (text: string) => {
    setEndTimeText(text);
    const parsed = parseTimeText(text);
    if (parsed) {
      const newDate = new Date(endDate);
      newDate.setHours(parsed.hours, parsed.minutes);
      setEndDate(newDate);
    }
  };

  // Handle picker changes
  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (event.type === 'set' && date) {
      const newDate = new Date(startDate);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setStartDate(newDate);
      syncStartTexts(newDate);
    }
  };

  const handleStartTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (event.type === 'set' && date) {
      const newDate = new Date(startDate);
      newDate.setHours(date.getHours(), date.getMinutes());
      setStartDate(newDate);
      syncStartTexts(newDate);
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (event.type === 'set' && date) {
      const newDate = new Date(endDate);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setEndDate(newDate);
      syncEndTexts(newDate);
    }
  };

  const handleEndTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (event.type === 'set' && date) {
      const newDate = new Date(endDate);
      newDate.setHours(date.getHours(), date.getMinutes());
      setEndDate(newDate);
      syncEndTexts(newDate);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a timer name');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Invalid Range', 'End date must be after start date');
      return;
    }

    addTimer({
      name: name.trim(),
      type: 'custom',
      mode,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      kind: 'custom',
      viewMode: mode,
      defaultViewMode: mode,
    });

    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Name */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Timer Name *</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="e.g., Vacation, Christmas, Project Deadline"
          placeholderTextColor={theme.textTertiary}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Start Date/Time */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Start</Text>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateInputWrapper}>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="TT.MM.JJJJ"
              placeholderTextColor={theme.textTertiary}
              value={startDateText}
              onChangeText={handleStartDateTextChange}
              keyboardType="numeric"
              maxLength={10}
            />
            <Pressable
              onPress={() => setShowStartDatePicker(true)}
              style={[styles.calendarButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.calendarButtonText}>📅</Text>
            </Pressable>
          </View>
          <View style={styles.timeInputWrapper}>
            <TextInput
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="HH:MM"
              placeholderTextColor={theme.textTertiary}
              value={startTimeText}
              onChangeText={handleStartTimeTextChange}
              keyboardType="numeric"
              maxLength={5}
            />
            <Pressable
              onPress={() => setShowStartTimePicker(true)}
              style={[styles.timePickerButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.calendarButtonText}>🕐</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* End Date/Time */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>End</Text>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateInputWrapper}>
            <TextInput
              style={[
                styles.dateInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="TT.MM.JJJJ"
              placeholderTextColor={theme.textTertiary}
              value={endDateText}
              onChangeText={handleEndDateTextChange}
              keyboardType="numeric"
              maxLength={10}
            />
            <Pressable
              onPress={() => setShowEndDatePicker(true)}
              style={[styles.calendarButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.calendarButtonText}>📅</Text>
            </Pressable>
          </View>
          <View style={styles.timeInputWrapper}>
            <TextInput
              style={[
                styles.timeInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="HH:MM"
              placeholderTextColor={theme.textTertiary}
              value={endTimeText}
              onChangeText={handleEndTimeTextChange}
              keyboardType="numeric"
              maxLength={5}
            />
            <Pressable
              onPress={() => setShowEndTimePicker(true)}
              style={[styles.timePickerButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.calendarButtonText}>🕐</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Default View Mode */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Default View</Text>
        <View style={styles.buttonGroup}>
          {(['elapsed', 'remaining'] as TimerMode[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setMode(option)}
              style={[
                styles.button,
                {
                  backgroundColor: mode === option ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={{
                  color: mode === option ? '#fff' : theme.text,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.hint, { color: theme.textTertiary }]}>
          Tap the timer card to toggle between elapsed/remaining
        </Text>
      </View>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
      >
        <Text style={styles.saveButtonText}>Create Timer</Text>
      </Pressable>

      {/* Date/Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartTimeChange}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndTimeChange}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}
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
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInputWrapper: {
    flex: 2,
    flexDirection: 'row',
    gap: 4,
  },
  timeInputWrapper: {
    flex: 1.5,
    flexDirection: 'row',
    gap: 4,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  calendarButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerButton: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButtonText: {
    fontSize: 18,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
