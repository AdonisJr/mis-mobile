import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ProgressBarProps = { value: number; max: number; accessibilityLabel: string };

function toRatio(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(Math.max(value / max, 0), 1);
}

export function ProgressBar({ value, max, accessibilityLabel }: ProgressBarProps) {
  const theme = useTheme();
  const ratio = toRatio(value, max);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max, now: value }}
      style={[styles.track, { backgroundColor: theme.track }]}>
      <View style={[styles.fill, { backgroundColor: theme.graphic, width: `${ratio * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: Spacing.two,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
