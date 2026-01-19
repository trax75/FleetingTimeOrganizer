import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Svg, { Path } from 'react-native-svg';
import type {
  LifeTimer,
  LifeTimerData,
  LifeTimerProgress,
  Sex,
  SmokingStatus,
  ActivityLevel,
  ChronicCondition,
} from '@ultimate-timer/shared';
import {
  calculateLifeExpectancyOffline,
  calculateLifeTimerProgressOffline,
  getCountriesOffline,
  getDefaultCountryOffline,
  formatPercent,
  LIFE_TIMER_DISCLAIMER,
  TIMER_UPDATE_INTERVAL,
} from '@ultimate-timer/shared';
import { useLifeTimerStore } from '../../src/stores/lifeTimerStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTheme } from '../../src/hooks/useTheme';
import { useInterval } from '../../src/hooks/useInterval';
import { DonutChart } from '../../src/components/DonutChart';
import { colors } from '../../src/theme/colors';

const COUNTRIES = getCountriesOffline();
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function PlusIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

interface LifeTimerCardProps {
  lifeTimer: LifeTimer;
  progress: LifeTimerProgress;
  percentDecimals: 1 | 2 | 3;
  mode: 'elapsed' | 'remaining';
  onPress: () => void;
  onLongPress: () => void;
}

function LifeTimerCard({ lifeTimer, progress, percentDecimals, mode, onPress, onLongPress }: LifeTimerCardProps) {
  const { theme } = useTheme();
  const displayPercent = mode === 'remaining' ? 100 - progress.percent : progress.percent;
  const years = mode === 'remaining' ? progress.yearsRemaining : progress.yearsLived;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
        {lifeTimer.name}
      </Text>
      <View style={[styles.badge, { backgroundColor: `${colors.timer.life}20` }]}>
        <Text style={[styles.badgeText, { color: colors.timer.life }]}>
          {mode.toUpperCase()}
        </Text>
      </View>
      <View style={styles.chartContainer}>
        <DonutChart
          percent={displayPercent}
          size={100}
          strokeWidth={8}
          color={colors.timer.life}
        />
        <View style={styles.percentOverlay}>
          <Text style={[styles.percent, { color: theme.text }]}>
            {formatPercent(displayPercent, percentDecimals)}
          </Text>
        </View>
      </View>
      <Text style={[styles.years, { color: theme.textSecondary }]}>
        ~{years.toFixed(1)} years
      </Text>
    </Pressable>
  );
}

export default function LifeScreen() {
  const { theme, isDark } = useTheme();
  const percentDecimals = useSettingsStore((state) => state.percentDecimals);
  const lifeTimers = useLifeTimerStore((state) => state.lifeTimers);
  const addLifeTimer = useLifeTimerStore((state) => state.addLifeTimer);
  const updateLifeTimer = useLifeTimerStore((state) => state.updateLifeTimer);
  const removeLifeTimer = useLifeTimerStore((state) => state.removeLifeTimer);

  // View modes for each timer (elapsed/remaining toggle)
  const [viewModes, setViewModes] = useState<Record<string, 'elapsed' | 'remaining'>>({});

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(new Date(1990, 0, 1));
  const [country, setCountry] = useState(getDefaultCountryOffline());
  const [sex, setSex] = useState<Sex>('unspecified');
  const [smokingStatus, setSmokingStatus] = useState<SmokingStatus>('never');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [parentReached85, setParentReached85] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [chronicConditions, setChronicConditions] = useState<ChronicCondition[]>([]);

  // Date input and picker
  const [birthDateText, setBirthDateText] = useState('01.01.1990');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  // Toggle chronic condition (multi-select)
  const toggleChronicCondition = (condition: ChronicCondition) => {
    if (condition === 'none') {
      // Selecting "None" clears all other selections
      setChronicConditions([]);
    } else {
      setChronicConditions((prev) => {
        if (prev.includes(condition)) {
          return prev.filter((c) => c !== condition);
        } else {
          return [...prev, condition];
        }
      });
    }
  };

  // Parse date from text input (DD.MM.YYYY format)
  const parseDateText = (text: string): Date | null => {
    const parts = text.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (year < 1900 || year > new Date().getFullYear()) return null;
    if (month < 0 || month > 11) return null;
    if (day < 1 || day > 31) return null;
    const date = new Date(year, month, day);
    if (date.getMonth() !== month) return null; // Invalid day for month
    return date;
  };

  // Handle text input change for birth date
  const handleBirthDateTextChange = (text: string) => {
    setBirthDateText(text);
    const parsed = parseDateText(text);
    if (parsed) {
      setBirthDate(parsed);
    }
  };

  // Sync birthDateText when birthDate changes from picker
  const syncBirthDateText = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    setBirthDateText(`${day}.${month}.${year}`);
  };

  const handleBirthDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowBirthDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setBirthDate(date);
      syncBirthDateText(date);
    }
  };

  // Force re-render for progress updates
  const tick = useInterval(TIMER_UPDATE_INTERVAL);

  // Calculate progress for all life timers
  const timerProgresses = useMemo(() => {
    return lifeTimers.map((timer) => {
      if (!timer.data?.birthDate || !timer.result) {
        return { timer, progress: null };
      }
      const progress = calculateLifeTimerProgressOffline(
        new Date(timer.data.birthDate),
        timer.result.adjustedYears,
        timer.result.rangeMin,
        timer.result.rangeMax
      );
      return { timer, progress };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifeTimers, tick]);

  const resetForm = () => {
    setName('');
    setBirthDate(new Date(1990, 0, 1));
    setBirthDateText('01.01.1990');
    setCountry(getDefaultCountryOffline());
    setSex('unspecified');
    setSmokingStatus('never');
    setActivityLevel('moderate');
    setParentReached85('unknown');
    setChronicConditions([]);
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (timer: LifeTimer) => {
    setEditingId(timer.id);
    setName(timer.name);
    const editDate = new Date(timer.data.birthDate);
    setBirthDate(editDate);
    syncBirthDateText(editDate);
    setCountry(timer.data.country);
    setSex(timer.data.sex);
    setSmokingStatus(timer.data.smokingStatus);
    setActivityLevel(timer.data.activityLevel);
    setParentReached85(timer.data.parentReached85);
    // Handle both old single value and new array format
    const conditions = Array.isArray(timer.data.chronicConditions)
      ? timer.data.chronicConditions
      : (timer.data as any).chronicCondition && (timer.data as any).chronicCondition !== 'none'
        ? [(timer.data as any).chronicCondition]
        : [];
    setChronicConditions(conditions);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a name for this life timer');
      return;
    }

    if (!birthDate) {
      Alert.alert('Required', 'Please select your birth date');
      return;
    }

    const birthDateString = toISODateString(birthDate);

    const data: LifeTimerData = {
      birthDate: birthDateString,
      country,
      sex,
      smokingStatus,
      activityLevel,
      parentReached85,
      chronicConditions,
    };

    const result = calculateLifeExpectancyOffline(data);

    if (editingId) {
      updateLifeTimer(editingId, { name: name.trim(), data, result });
    } else {
      addLifeTimer(name.trim(), data, result);
    }

    resetForm();
    setShowForm(false);
  };

  const handleRemove = (id: string, timerName: string) => {
    Alert.alert(
      'Remove Life Timer',
      `Are you sure you want to remove "${timerName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeLifeTimer(id),
        },
      ]
    );
  };

  const toggleViewMode = (id: string) => {
    setViewModes((prev) => ({
      ...prev,
      [id]: prev[id] === 'remaining' ? 'elapsed' : 'remaining',
    }));
  };

  // Show form for adding/editing
  if (showForm) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {editingId ? 'Edit Life Timer' : 'New Life Timer'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Estimate life progress based on statistical data
        </Text>

        {/* Name Field */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="e.g., Torsten's Life Timer"
            placeholderTextColor={theme.textTertiary}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Birth Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Birth Date * (DD.MM.YYYY)</Text>
          <View style={styles.dateInputRow}>
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
              value={birthDateText}
              onChangeText={handleBirthDateTextChange}
              keyboardType="numeric"
              maxLength={10}
            />
            <Pressable
              onPress={() => setShowBirthDatePicker(true)}
              style={[
                styles.calendarButton,
                {
                  backgroundColor: theme.primary,
                },
              ]}
            >
              <Text style={styles.calendarButtonText}>📅</Text>
            </Pressable>
          </View>
        </View>

        {/* Country */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Country</Text>
          <View style={styles.countryGrid}>
            {COUNTRIES.map((c) => (
              <Pressable
                key={c.code}
                onPress={() => setCountry(c.code)}
                style={[
                  styles.countryButton,
                  {
                    backgroundColor: country === c.code ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: country === c.code ? '#fff' : theme.text,
                    fontSize: 12,
                  }}
                  numberOfLines={1}
                >
                  {c.code}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sex */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Sex at Birth</Text>
          <View style={styles.buttonGroup}>
            {(['unspecified', 'male', 'female'] as Sex[]).map((option) => (
              <Pressable
                key={option}
                onPress={() => setSex(option)}
                style={[
                  styles.button,
                  {
                    backgroundColor: sex === option ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: sex === option ? '#fff' : theme.text,
                    fontSize: 14,
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section: Lifestyle Factors */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Lifestyle Factors
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          These factors adjust the life expectancy estimate
        </Text>

        {/* Smoking Status */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Smoking</Text>
          <View style={styles.buttonGroup}>
            {([
              { value: 'never', label: 'Never' },
              { value: 'former', label: 'Former' },
              { value: 'current', label: 'Current' },
            ] as { value: SmokingStatus; label: string }[]).map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setSmokingStatus(option.value)}
                style={[
                  styles.button,
                  {
                    backgroundColor: smokingStatus === option.value ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: smokingStatus === option.value ? '#fff' : theme.text,
                    fontSize: 14,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Physical Activity</Text>
          <View style={styles.buttonGroup}>
            {([
              { value: 'sedentary', label: 'Sedentary' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'active', label: 'Active' },
            ] as { value: ActivityLevel; label: string }[]).map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setActivityLevel(option.value)}
                style={[
                  styles.button,
                  {
                    backgroundColor: activityLevel === option.value ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: activityLevel === option.value ? '#fff' : theme.text,
                    fontSize: 14,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Parent Reached 85 */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Did a parent live past 85?</Text>
          <View style={styles.buttonGroup}>
            {([
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'unknown', label: 'Unknown' },
            ] as { value: 'yes' | 'no' | 'unknown'; label: string }[]).map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setParentReached85(option.value)}
                style={[
                  styles.button,
                  {
                    backgroundColor: parentReached85 === option.value ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: parentReached85 === option.value ? '#fff' : theme.text,
                    fontSize: 14,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Chronic Conditions (Multi-Select) */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Chronic Health Conditions</Text>
          <Text style={[styles.fieldHint, { color: theme.textTertiary }]}>
            Select all that apply (or None)
          </Text>
          <View style={styles.buttonGroupWrap}>
            {([
              { value: 'none', label: 'None' },
              { value: 'cardiovascular', label: 'Heart Disease' },
              { value: 'diabetes', label: 'Diabetes' },
              { value: 'cancer', label: 'Cancer' },
              { value: 'respiratory', label: 'Respiratory' },
              { value: 'other', label: 'Other' },
            ] as { value: ChronicCondition; label: string }[]).map((option) => {
              const isSelected = option.value === 'none'
                ? chronicConditions.length === 0
                : chronicConditions.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  onPress={() => toggleChronicCondition(option.value)}
                  style={[
                    styles.buttonSmall,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isSelected ? '#fff' : theme.text,
                      fontSize: 12,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: theme.surfaceSecondary }]}>
          <Text style={[styles.disclaimerText, { color: theme.textSecondary }]}>
            {LIFE_TIMER_DISCLAIMER}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.formButtons}>
          <Pressable
            onPress={() => {
              resetForm();
              setShowForm(false);
            }}
            style={[styles.cancelButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.saveButtonText}>
              {editingId ? 'Update' : 'Create'}
            </Text>
          </Pressable>
        </View>

        {/* Remove button when editing */}
        {editingId && (
          <Pressable
            onPress={() => {
              const timer = lifeTimers.find((t) => t.id === editingId);
              if (timer) {
                handleRemove(timer.id, timer.name);
                resetForm();
                setShowForm(false);
              }
            }}
            style={[styles.removeButton, { borderColor: '#ef4444' }]}
          >
            <Text style={styles.removeButtonText}>Remove Life Timer</Text>
          </Pressable>
        )}

        {/* Birth Date Picker */}
        {showBirthDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleBirthDateChange}
            themeVariant={isDark ? 'dark' : 'light'}
            maximumDate={new Date()}
          />
        )}
      </ScrollView>
    );
  }

  // Show life timers list
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Life Timer Grid */}
        {timerProgresses.length > 0 ? (
          <View style={styles.grid}>
            {timerProgresses.map(({ timer, progress }) => {
              if (!progress) return null;
              const viewMode = viewModes[timer.id] || 'elapsed';
              return (
                <View key={timer.id} style={styles.cardWrapper}>
                  <LifeTimerCard
                    lifeTimer={timer}
                    progress={progress}
                    percentDecimals={percentDecimals}
                    mode={viewMode}
                    onPress={() => toggleViewMode(timer.id)}
                    onLongPress={() => handleEdit(timer)}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No life timers yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Tap the button below to create your first life timer
            </Text>
          </View>
        )}

        {/* Add Button - below timers */}
        <Pressable
          onPress={handleAddNew}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: theme.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <PlusIcon color="#fff" size={20} />
          <Text style={styles.addButtonText}>Add Life Timer</Text>
        </Pressable>

        {/* Help text */}
        {timerProgresses.length > 0 && (
          <View style={styles.helpContainer}>
            <Text style={[styles.helpText, { color: theme.textTertiary }]}>
              Tap to toggle elapsed/remaining
            </Text>
            <Text style={[styles.helpText, { color: theme.textTertiary }]}>
              Long press to edit or remove
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
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
  dateInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  calendarButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButtonText: {
    fontSize: 20,
  },
  fieldHint: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  countryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonGroupWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  disclaimer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentOverlay: {
    position: 'absolute',
  },
  percent: {
    fontSize: 18,
    fontWeight: '700',
  },
  years: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 4,
  },
  helpText: {
    fontSize: 12,
  },
});
