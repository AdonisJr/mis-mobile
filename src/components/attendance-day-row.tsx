import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { StatusChip, type StatusTone } from '@/components/ui/status-chip';
import { Spacing } from '@/constants/theme';
import type { AttendanceDay, AttendanceStatus } from '@/types/attendance';

const NO_TIME_TEXT = '\u2014';
const NOON_HOUR = 12;
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ChipSpec = { label: string; tone: StatusTone };

const ATTENDANCE_CHIPS: Record<AttendanceStatus, ChipSpec> = {
  present: { label: 'Present', tone: 'present' },
  late: { label: 'Late', tone: 'late' },
};

const TIMED_OUT_CHIP: ChipSpec = { label: 'Timed out', tone: 'timedOut' };

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

export function AttendanceStatusChips({ day }: { day: AttendanceDay }) {
  const statusChip = ATTENDANCE_CHIPS[day.status];

  return (
    <View style={styles.chips}>
      <StatusChip label={statusChip.label} tone={statusChip.tone} />
      {day.time_out !== null ? (
        <StatusChip label={TIMED_OUT_CHIP.label} tone={TIMED_OUT_CHIP.tone} />
      ) : null}
    </View>
  );
}

export function AttendanceTimes({ day }: { day: AttendanceDay }) {
  return (
    <View style={styles.cells}>
      <TimeCell label="Time in" value={formatClockTime(day.time_in)} />
      <TimeCell label="Time out" value={formatClockTime(day.time_out)} />
    </View>
  );
}

export function AttendanceDayRow({ day }: { day: AttendanceDay }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold">{formatDayLabel(day.date)}</ThemedText>
        <AttendanceStatusChips day={day} />
      </View>
      <AttendanceTimes day={day} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
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
  cells: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  cell: {
    minWidth: 80,
    gap: Spacing.half,
  },
});
