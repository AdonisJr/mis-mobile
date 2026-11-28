import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PillButtonHeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DISABLED_OPACITY = 0.5;

export type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  isDisabled = false,
  isLoading = false,
}: PrimaryButtonProps) {
  const theme = useTheme();
  const isInactive = isDisabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isInactive}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: theme.accent },
        isInactive && styles.inactive,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={theme.onAccent} />
      ) : (
        <ThemedText type="smallBold" themeColor="onAccent">
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: PillButtonHeight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    opacity: DISABLED_OPACITY,
  },
});
