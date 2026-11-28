import { StyleSheet, type ViewProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';

export function Card({ style, ...viewProps }: ViewProps) {
  return <ThemedView type="backgroundElement" style={[styles.card, style]} {...viewProps} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.three + Spacing.one,
    gap: Spacing.three,
  },
});
