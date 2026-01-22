import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import type { TimerMode, NotificationThreshold } from '@ultimate-timer/shared';
import { useTimerStore } from '../../src/stores/timerStore';
import { useTheme } from '../../src/hooks/useTheme';
import { generateShareText } from '../../src/services/shareService';
import { requestNotificationPermission } from '../../src/services/notificationService';

const NOTIFICATION_OPTIONS: { value: NotificationThreshold; label: string }[] = [
  { value: 50, label: '50%' },
  { value: 80, label: '80%' },
  { value: 100, label: '100%' },
];

function ShareIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function formatDateForInput(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
}

function formatTimeForInput(isoString: string): string {
  const date = new Date(isoString);
  return date.toTimeString().slice(0, 5);
}

export default function EditTimerScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const timers = useTimerStore((state) => state.timers);
  const updateTimer = useTimerStore((state) => state.updateTimer);
  const deleteTimer = useTimerStore((state) => state.deleteTimer);

  const timer = timers.find((t) => t.id === id);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');
  const [defaultMode, setDefaultMode] = useState<TimerMode>('elapsed');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationThresholds, setNotificationThresholds] = useState<NotificationThreshold[]>([100]);

  const toggleThreshold = (threshold: NotificationThreshold) => {
    setNotificationThresholds((prev) =>
      prev.includes(threshold)
        ? prev.filter((t) => t !== threshold)
        : [...prev, threshold].sort((a, b) => a - b)
    );
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
      } else {
        Alert.alert(
          'Permission Required',
          'Notifications are disabled. Please enable them in your device settings to receive timer alerts.',
          [{ text: 'OK' }]
        );
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  useEffect(() => {
    if (timer) {
      setName(timer.name);
      if (timer.startDate) {
        setStartDate(formatDateForInput(timer.startDate));
        setStartTime(formatTimeForInput(timer.startDate));
      }
      if (timer.endDate) {
        setEndDate(formatDateForInput(timer.endDate));
        setEndTime(formatTimeForInput(timer.endDate));
      }
      setDefaultMode(timer.defaultViewMode || timer.mode);
      setNotificationsEnabled(timer.notifications?.enabled ?? false);
      setNotificationThresholds(timer.notifications?.thresholds ?? [100]);
    }
  }, [timer]);

  if (!timer) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Timer not found
        </Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a timer name');
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert('Required', 'Please enter start and end dates');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      Alert.alert('Invalid Date', 'Please use YYYY-MM-DD format');
      return;
    }

    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(`${endDate}T${endTime}:00`);

    if (end <= start) {
      Alert.alert('Invalid Range', 'End date must be after start date');
      return;
    }

    updateTimer(timer.id, {
      name: name.trim(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      defaultViewMode: defaultMode,
      notifications: {
        enabled: notificationsEnabled,
        thresholds: notificationThresholds,
      },
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Timer', `Are you sure you want to delete "${timer.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTimer(timer.id);
          router.back();
        },
      },
    ]);
  };

  const handleShare = async () => {
    try {
      const shareText = generateShareText(timer);
      await Share.share({
        message: shareText,
        title: `Share ${timer.name}`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
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
          placeholder="My Timer"
          placeholderTextColor={theme.textTertiary}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Start Date/Time */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Start Date *</Text>
        <View style={styles.dateTimeRow}>
          <TextInput
            style={[
              styles.input,
              styles.dateInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textTertiary}
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            style={[
              styles.input,
              styles.timeInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="HH:MM"
            placeholderTextColor={theme.textTertiary}
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>
      </View>

      {/* End Date/Time */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>End Date *</Text>
        <View style={styles.dateTimeRow}>
          <TextInput
            style={[
              styles.input,
              styles.dateInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textTertiary}
            value={endDate}
            onChangeText={setEndDate}
          />
          <TextInput
            style={[
              styles.input,
              styles.timeInput,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="HH:MM"
            placeholderTextColor={theme.textTertiary}
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>
      </View>

      {/* Default View Mode */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: theme.text }]}>Default View</Text>
        <View style={styles.buttonGroup}>
          {(['elapsed', 'remaining'] as TimerMode[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setDefaultMode(option)}
              style={[
                styles.button,
                {
                  backgroundColor: defaultMode === option ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={{
                  color: defaultMode === option ? '#fff' : theme.text,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.field}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.label, { color: theme.text, marginBottom: 0 }]}>Notifications</Text>
          <Pressable
            onPress={handleToggleNotifications}
            style={[
              styles.toggle,
              {
                backgroundColor: notificationsEnabled ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={{ color: notificationsEnabled ? '#fff' : theme.text, fontSize: 12 }}>
              {notificationsEnabled ? 'ON' : 'OFF'}
            </Text>
          </Pressable>
        </View>
        {notificationsEnabled && (
          <View style={styles.thresholdContainer}>
            <Text style={[styles.hint, { color: theme.textTertiary, marginBottom: 8 }]}>
              Get notified when progress reaches:
            </Text>
            <View style={styles.thresholdRow}>
              {NOTIFICATION_OPTIONS.map((option) => {
                const isSelected = notificationThresholds.includes(option.value);
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => toggleThreshold(option.value)}
                    style={[
                      styles.thresholdButton,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: isSelected ? '#fff' : theme.text,
                        fontSize: 14,
                        fontWeight: '500',
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: theme.primary, flex: 1 }]}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={[styles.shareButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <ShareIcon color={theme.text} size={20} />
        </Pressable>
      </View>

      {/* Delete Button */}
      <Pressable
        onPress={handleDelete}
        style={[styles.deleteButton, { borderColor: theme.border }]}
      >
        <Text style={styles.deleteButtonText}>Delete Timer</Text>
      </Pressable>
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
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
    paddingVertical: 10,
    fontSize: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  thresholdContainer: {
    marginTop: 4,
  },
  thresholdRow: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
  },
});
