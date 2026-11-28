import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  children?: ReactNode;
};

export function ScreenHeader({ title, subtitle, trailing, children }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleColumn}>
          <ThemedText type="subtitle" accessibilityRole="header">
            {title}
          </ThemedText>
          {subtitle ? <ThemedText themeColor="textSecondary">{subtitle}</ThemedText> : null}
        </View>
        {trailing}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  titleColumn: {
    flex: 1,
  },
});
