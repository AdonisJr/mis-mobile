import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type StatProps = { value: string; label: string; size?: 'large' | 'small' };

export function Stat({ value, label, size = 'large' }: StatProps) {
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.container}>
      <ThemedText type={size === 'large' ? 'stat' : 'smallBold'}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.half,
  },
});
