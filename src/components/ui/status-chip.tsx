import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type StatusTone = 'present' | 'late' | 'timedOut';

const TONE_COLORS: Record<StatusTone, { background: ThemeColor; text: ThemeColor }> = {
  present: { background: 'statusPresentBackground', text: 'statusPresentText' },
  late: { background: 'statusLateBackground', text: 'statusLateText' },
  timedOut: { background: 'statusTimedOutBackground', text: 'statusTimedOutText' },
};

export function StatusChip({ label, tone }: { label: string; tone: StatusTone }) {
  const theme = useTheme();
  const toneColors = TONE_COLORS[tone];

  return (
    <View style={[styles.chip, { backgroundColor: theme[toneColors.background] }]}>
      <ThemedText type="smallBold" themeColor={toneColors.text}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
});
