import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';

export type StatusMessageProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StatusMessage({ message, actionLabel, onAction }: StatusMessageProps) {
  return (
    <View style={styles.container}>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? <PrimaryButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  message: {
    textAlign: 'center',
  },
});
