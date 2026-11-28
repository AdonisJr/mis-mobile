import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import type { GeneralAverage } from '@/types/grades';

const INCOMPLETE_AVERAGE_TEXT = 'Not complete yet';

export function formatAverageLabel(average: GeneralAverage): string {
  if (average.term_number === null) return 'General average';
  return `Semester ${average.term_number} average`;
}

function formatAverageValue(average: GeneralAverage): string {
  if (average.rounded_average === null) return INCOMPLETE_AVERAGE_TEXT;
  return `${average.rounded_average} ${average.descriptor ?? ''}`.trim();
}

export function GeneralAverageBlock({ average }: { average: GeneralAverage }) {
  return (
    <Card style={styles.block}>
      <ThemedText type="smallBold">{formatAverageLabel(average)}</ThemedText>
      <ThemedText type="smallBold">{formatAverageValue(average)}</ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
