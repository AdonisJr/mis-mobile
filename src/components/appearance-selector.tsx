import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { AppearancePreference } from '@/types/appearance';

const APPEARANCE_OPTIONS: { value: AppearancePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export type AppearanceSelectorProps = {
  value: AppearancePreference;
  onSelect: (preference: AppearancePreference) => void;
};

export function AppearanceSelector({ value, onSelect }: AppearanceSelectorProps) {
  const theme = useTheme();

  return (
    <View accessibilityRole="radiogroup" style={styles.row}>
      {APPEARANCE_OPTIONS.map((option) => {
        const isChecked = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: isChecked }}
            onPress={() => onSelect(option.value)}
            style={[
              styles.pill,
              { backgroundColor: isChecked ? theme.accent : theme.backgroundSelected },
            ]}>
            <ThemedText type="smallBold" themeColor={isChecked ? 'onAccent' : 'text'}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pill: {
    flex: 1,
    minHeight: TouchTarget,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
