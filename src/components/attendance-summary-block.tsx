import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { AttendanceSummary } from '@/types/attendance';

function SummaryCell({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.cell}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{String(value)}</ThemedText>
    </View>
  );
}

export function AttendanceSummaryBlock({ summary }: { summary: AttendanceSummary }) {
  return (
    <ThemedView type="backgroundSelected" style={styles.block}>
      <SummaryCell label="Present" value={summary.present} />
      <SummaryCell label="Late" value={summary.late} />
      <SummaryCell label="Absent" value={summary.absent} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  cell: {
    alignItems: 'center',
    gap: Spacing.half,
  },
});
