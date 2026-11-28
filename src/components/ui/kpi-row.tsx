import { StyleSheet, View } from 'react-native';

import { Stat } from '@/components/ui/stat';
import { Spacing } from '@/constants/theme';

export type KpiItem = { label: string; value: string };

export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.cell}>
          <Stat value={item.value} label={item.label} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  cell: {
    flex: 1,
  },
});
