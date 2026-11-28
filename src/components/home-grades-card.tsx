import { StyleSheet, View } from 'react-native';

import { formatAverageLabel } from '@/components/general-average-block';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { KpiRow, type KpiItem } from '@/components/ui/kpi-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { GRADES_EMPTY_MESSAGE } from '@/hooks/use-grades';
import type { GradesResponse, QuarterGrade, SubjectGradeRow } from '@/types/grades';

const GRADE_SCALE_MAX = 100;

type LatestGradeRow = { row: SubjectGradeRow; quarterGrade: QuarterGrade };

function findLatestQuarter(row: SubjectGradeRow): QuarterGrade | null {
  return [...row.quarters].reverse().find((quarterGrade) => quarterGrade.grade !== null) ?? null;
}

function collectLatestGradeRows(grades: GradesResponse): LatestGradeRow[] {
  return grades.subjects.flatMap((row) => {
    const quarterGrade = findLatestQuarter(row);
    return quarterGrade ? [{ row, quarterGrade }] : [];
  });
}

function buildAverageKpis(grades: GradesResponse): KpiItem[] {
  return grades.general_averages.flatMap((average) =>
    average.rounded_average === null
      ? []
      : [{ label: formatAverageLabel(average), value: String(average.rounded_average) }],
  );
}

function formatSubjectTitle(row: SubjectGradeRow): string {
  if (row.term_number === null) return row.subject.name;
  return row.subject.name + ' \u00b7 Semester ' + row.term_number;
}

function LatestGradeLine({ latestGradeRow }: { latestGradeRow: LatestGradeRow }) {
  const { row, quarterGrade } = latestGradeRow;

  return (
    <View style={styles.gradeLine}>
      <View style={styles.gradeHeader}>
        <ThemedText type="small" style={styles.subjectTitle}>
          {formatSubjectTitle(row)}
        </ThemedText>
        <ThemedText type="smallBold">
          Q{quarterGrade.quarter} {quarterGrade.grade}
        </ThemedText>
      </View>
      <ProgressBar
        value={quarterGrade.grade ?? 0}
        max={GRADE_SCALE_MAX}
        accessibilityLabel={row.subject.name}
      />
    </View>
  );
}

export type HomeGradesCardProps = { grades: GradesResponse; onViewGrades: () => void };

export function HomeGradesCard({ grades, onViewGrades }: HomeGradesCardProps) {
  const latestGradeRows = collectLatestGradeRows(grades);
  const averageKpis = buildAverageKpis(grades);

  return (
    <Card>
      <ThemedText type="smallBold">Latest grades</ThemedText>
      {latestGradeRows.length === 0 ? (
        <ThemedText themeColor="textSecondary">{GRADES_EMPTY_MESSAGE}</ThemedText>
      ) : (
        latestGradeRows.map((latestGradeRow) => (
          <LatestGradeLine
            key={latestGradeRow.row.curriculum_entry_id}
            latestGradeRow={latestGradeRow}
          />
        ))
      )}
      {averageKpis.length > 0 ? <KpiRow items={averageKpis} /> : null}
      <SecondaryButton label="View grades" onPress={onViewGrades} />
    </Card>
  );
}

const styles = StyleSheet.create({
  gradeLine: {
    gap: Spacing.one,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  subjectTitle: {
    flex: 1,
  },
});
