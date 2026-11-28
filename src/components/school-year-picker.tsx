import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { NamedRef } from '@/types/auth';

export type SchoolYearPickerProps = {
  schoolYears: NamedRef[];
  selectedId: number | null;
  onSelect: (schoolYearId: number) => void;
};

export function SchoolYearPicker({ schoolYears, selectedId, onSelect }: SchoolYearPickerProps) {
  const theme = useTheme();
  if (schoolYears.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {schoolYears.map((schoolYear) => {
        const isSelected = schoolYear.id === selectedId;
        return (
          <Pressable
            key={schoolYear.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(schoolYear.id)}
            style={[
              styles.chip,
              { backgroundColor: isSelected ? theme.accent : theme.backgroundElement },
            ]}>
            <ThemedText type="small" themeColor={isSelected ? 'onAccent' : 'text'}>
              {schoolYear.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
  },
  chip: {
    minHeight: TouchTarget,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
  },
});
