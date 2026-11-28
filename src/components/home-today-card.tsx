import { StyleSheet } from 'react-native';

import { AttendanceStatusChips, AttendanceTimes } from '@/components/attendance-day-row';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import type { AttendanceDay } from '@/types/attendance';

export const TODAY_EMPTY_MESSAGE = 'No scan yet today.';
const ZERO_PAD_LENGTH = 2;

function padTwoDigits(value: number): string {
  return String(value).padStart(ZERO_PAD_LENGTH, '0');
}

function formatLocalIsoDate(date: Date): string {
  const month = padTwoDigits(date.getMonth() + 1);
  const dayOfMonth = padTwoDigits(date.getDate());
  return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}

export function HomeTodayCard({ days }: { days: AttendanceDay[] }) {
  const todayDate = formatLocalIsoDate(new Date());
  const todayRow = days.find((day) => day.date === todayDate);

  return (
    <Card style={styles.card}>
      <ThemedText type="smallBold">Today</ThemedText>
      {todayRow ? (
        <>
          <AttendanceStatusChips day={todayRow} />
          <AttendanceTimes day={todayRow} />
        </>
      ) : (
        <ThemedText themeColor="textSecondary">{TODAY_EMPTY_MESSAGE}</ThemedText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
  },
});
