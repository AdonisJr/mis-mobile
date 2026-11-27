import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { SubjectGradeRow } from '@/types/grades';

const FAILED_REMARK = 'Failed';

function formatGrade(grade: number | null): string {
  return grade === null ? '' : String(grade);
}

function GradeCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

export function SubjectGradeCard({ row }: { row: SubjectGradeRow }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">{row.subject.name}</ThemedText>
      {row.term_number !== null ? (
        <ThemedText type="small" themeColor="textSecondary">
          Semester {row.term_number}
        </ThemedText>
      ) : null}
      <View style={styles.cells}>
        {row.quarters.map((quarterGrade) => (
          <GradeCell
            key={quarterGrade.quarter}
            label={`Q${quarterGrade.quarter}`}
            value={formatGrade(quarterGrade.grade)}
          />
        ))}
        <GradeCell label="Final" value={formatGrade(row.final_grade)} />
      </View>
      <ThemedText type="small" themeColor={row.remarks === FAILED_REMARK ? 'danger' : 'textSecondary'}>
        {row.remarks ?? ''}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  cells: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  cell: {
    minWidth: 40,
    gap: Spacing.half,
  },
});
