import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, type ThemeColor } from '@/constants/theme';
import type { AttendanceDay, AttendanceStatus } from '@/types/attendance';

const NO_TIME_TEXT = '—';
const NOON_HOUR = 12;
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type StatusChipStyle = { label: string; background: ThemeColor; text: ThemeColor };

const STATUS_CHIPS: Record<AttendanceStatus, StatusChipStyle> = {
  present: { label: 'Present', background: 'statusPresentBackground', text: 'statusPresentText' },
  late: { label: 'Late', background: 'statusLateBackground', text: 'statusLateText' },
};

const TIMED_OUT_CHIP: StatusChipStyle = {
  label: 'Timed out',
  background: 'statusTimedOutBackground',
  text: 'statusTimedOutText',
};

function formatDayLabel(date: string): string {
  const [year, monthNumber, dayNumber] = date.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, monthNumber - 1, dayNumber)).getUTCDay();
  return `${WEEKDAY_NAMES[weekday]} ${dayNumber}`;
}

function formatClockTime(time: string | null): string {
  if (time === null) return NO_TIME_TEXT;
  const hours = Number(time.slice(0, 2));
  const minutes = time.slice(3, 5);
  const suffix = hours >= NOON_HOUR ? 'PM' : 'AM';
  const displayHour = hours % NOON_HOUR === 0 ? NOON_HOUR : hours % NOON_HOUR;
  return `${displayHour}:${minutes} ${suffix}`;
}

function StatusChip({ chip }: { chip: StatusChipStyle }) {
  return (
    <ThemedView type={chip.background} style={styles.chip}>
      <ThemedText type="smallBold" themeColor={chip.text}>
        {chip.label}
      </ThemedText>
    </ThemedView>
  );
}

function TimeCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

export function AttendanceDayRow({ day }: { day: AttendanceDay }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{formatDayLabel(day.date)}</ThemedText>
        <View style={styles.chips}>
          <StatusChip chip={STATUS_CHIPS[day.status]} />
          {day.time_out !== null ? <StatusChip chip={TIMED_OUT_CHIP} /> : null}
        </View>
      </View>
      <View style={styles.cells}>
        <TimeCell label="Time in" value={formatClockTime(day.time_in)} />
        <TimeCell label="Time out" value={formatClockTime(day.time_out)} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.three,
  },
  cells: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  cell: {
    minWidth: 80,
    gap: Spacing.half,
  },
});
