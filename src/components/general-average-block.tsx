import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { GeneralAverage } from '@/types/grades';

const INCOMPLETE_AVERAGE_TEXT = 'Not complete yet';

function formatAverageLabel(average: GeneralAverage): string {
  if (average.term_number === null) return 'General average';
  return `Semester ${average.term_number} average`;
}

function formatAverageValue(average: GeneralAverage): string {
  if (average.rounded_average === null) return INCOMPLETE_AVERAGE_TEXT;
  return `${average.rounded_average} ${average.descriptor ?? ''}`.trim();
}

export function GeneralAverageBlock({ average }: { average: GeneralAverage }) {
  return (
    <ThemedView type="backgroundSelected" style={styles.block}>
      <ThemedText type="smallBold">{formatAverageLabel(average)}</ThemedText>
      <ThemedText type="smallBold">{formatAverageValue(average)}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
