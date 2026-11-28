import { StyleSheet, View } from 'react-native';

import { buildSummaryKpis, countRecordedDays } from '@/components/attendance-summary-block';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { CircularGauge } from '@/components/ui/circular-gauge';
import { KpiRow } from '@/components/ui/kpi-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { AttendanceSummary } from '@/types/attendance';

export const MONTH_EMPTY_MESSAGE = 'No school days recorded this month yet.';
const PERCENT_SCALE = 100;

function toPercent(part: number, whole: number): number {
  return Math.round((part / whole) * PERCENT_SCALE);
}

export function HomeMonthCard({ summary }: { summary: AttendanceSummary }) {
  const recordedDays = countRecordedDays(summary);

  if (recordedDays === 0) {
    return (
      <Card>
        <ThemedText type="smallBold">This month</ThemedText>
        <ThemedText themeColor="textSecondary">{MONTH_EMPTY_MESSAGE}</ThemedText>
      </Card>
    );
  }

  return (
    <Card>
      <ThemedText type="smallBold">This month</ThemedText>
      <CircularGauge
        percent={toPercent(summary.present + summary.late, recordedDays)}
        caption="Attendance rate"
      />
      <View style={styles.onTimeRow}>
        <ThemedText type="small" themeColor="textSecondary">
          On time
        </ThemedText>
        <ThemedText type="smallBold">{toPercent(summary.present, recordedDays)}%</ThemedText>
      </View>
      <ProgressBar value={summary.present} max={recordedDays} accessibilityLabel="On time" />
      <KpiRow items={buildSummaryKpis(summary)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  onTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
