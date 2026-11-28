import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { Spacing } from '@/constants/theme';
import type { SubjectGradeRow } from '@/types/grades';

const FAILED_REMARK = 'Failed';

function formatGrade(grade: number | null): string {
  return grade === null ? '' : String(grade);
}

export function SubjectGradeCard({ row }: { row: SubjectGradeRow }) {
  return (
    <Card style={styles.card}>
      <ThemedText type="smallBold">{row.subject.name}</ThemedText>
      {row.term_number !== null ? (
        <ThemedText type="small" themeColor="textSecondary">
          Semester {row.term_number}
        </ThemedText>
      ) : null}
      <View style={styles.cells}>
        {row.quarters.map((quarterGrade) => (
          <Stat
            key={quarterGrade.quarter}
            size="small"
            label={`Q${quarterGrade.quarter}`}
            value={formatGrade(quarterGrade.grade)}
          />
        ))}
        <Stat size="small" label="Final" value={formatGrade(row.final_grade)} />
      </View>
      <ThemedText type="small" themeColor={row.remarks === FAILED_REMARK ? 'danger' : 'textSecondary'}>
        {row.remarks ?? ''}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  cells: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
});
