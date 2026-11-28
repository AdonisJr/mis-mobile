import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GeneralAverageBlock } from '@/components/general-average-block';
import { SchoolYearPicker } from '@/components/school-year-picker';
import { StatusMessage } from '@/components/status-message';
import { SubjectGradeCard } from '@/components/subject-grade-card';
import { ThemedView } from '@/components/themed-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { GRADES_EMPTY_MESSAGE, useGrades } from '@/hooks/use-grades';

export default function GradesScreen() {
  const {
    grades,
    errorMessage,
    isLoading,
    isRefreshing,
    hasSubmittedGrades,
    selectSchoolYear,
    reload,
    refresh,
  } = useGrades();

  function renderGradesBody() {
    if (isLoading) return <ActivityIndicator />;
    if (errorMessage) {
      return <StatusMessage message={errorMessage} actionLabel="Retry" onAction={reload} />;
    }
    if (!grades || !hasSubmittedGrades) return <StatusMessage message={GRADES_EMPTY_MESSAGE} />;
    return (
      <>
        {grades.subjects.map((row) => (
          <SubjectGradeCard key={row.curriculum_entry_id} row={row} />
        ))}
        {grades.general_averages.map((average) => (
          <GeneralAverageBlock key={average.term_number ?? 0} average={average} />
        ))}
      </>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
          <ScreenHeader title="Grades" subtitle={grades?.school_year?.name}>
            <SchoolYearPicker
              schoolYears={grades?.school_years ?? []}
              selectedId={grades?.school_year?.id ?? null}
              onSelect={selectSchoolYear}
            />
          </ScreenHeader>
          {renderGradesBody()}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  content: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
