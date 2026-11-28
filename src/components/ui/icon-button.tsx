import { Pressable, StyleSheet } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconButtonProps = {
  icon: AppIconName;
  accessibilityLabel: string;
  onPress: () => void;
  isDisabled?: boolean;
};

export function IconButton({ icon, accessibilityLabel, onPress, isDisabled = false }: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
      <AppIcon name={icon} color={isDisabled ? 'textSecondary' : 'text'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: TouchTarget,
    height: TouchTarget,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
