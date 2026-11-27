import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { NamedRef } from '@/types/auth';

export type SchoolYearPickerProps = {
  schoolYears: NamedRef[];
  selectedId: number | null;
  onSelect: (schoolYearId: number) => void;
};

export function SchoolYearPicker({ schoolYears, selectedId, onSelect }: SchoolYearPickerProps) {
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
            onPress={() => onSelect(schoolYear.id)}>
            <ThemedView
              type={isSelected ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.chip}>
              <ThemedText type="small" themeColor={isSelected ? 'text' : 'textSecondary'}>
                {schoolYear.name}
              </ThemedText>
            </ThemedView>
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
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
