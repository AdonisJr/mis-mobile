import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

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
      <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={onSelectPrevious}>
        <ThemedView type="backgroundElement" style={styles.chip}>
          <ThemedText type="smallBold">‹</ThemedText>
        </ThemedView>
      </Pressable>
      <ThemedText type="smallBold">{formatMonthLabel(month)}</ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next month"
        accessibilityState={{ disabled: !canSelectNext }}
        disabled={!canSelectNext}
        onPress={onSelectNext}>
        <ThemedView type="backgroundElement" style={styles.chip}>
          <ThemedText type="smallBold" themeColor={canSelectNext ? 'text' : 'textSecondary'}>
            ›
          </ThemedText>
        </ThemedView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
