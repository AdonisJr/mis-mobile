import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export type MonthSwitcherProps = {
  month: string;
  canSelectNext: boolean;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
};

function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return `${MONTH_NAMES[monthNumber - 1]} ${year}`;
}

export function MonthSwitcher({
  month,
  canSelectNext,
  onSelectPrevious,
  onSelectNext,
}: MonthSwitcherProps) {
  return (
    <View style={styles.row}>
      <IconButton icon="previous" accessibilityLabel="Previous month" onPress={onSelectPrevious} />
      <ThemedText type="smallBold">{formatMonthLabel(month)}</ThemedText>
      <IconButton
        icon="next"
        accessibilityLabel="Next month"
        onPress={onSelectNext}
        isDisabled={!canSelectNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
