import { router } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { countRecordedDays } from '@/components/attendance-summary-block';
import { HomeGradesCard } from '@/components/home-grades-card';
import { HomeMonthCard } from '@/components/home-month-card';
import { HomeTodayCard } from '@/components/home-today-card';
import { StatusMessage } from '@/components/status-message';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/avatar';
import { ScreenHeader } from '@/components/ui/screen-header';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAttendance } from '@/hooks/use-attendance';
import { useGrades } from '@/hooks/use-grades';
import { useProfile } from '@/hooks/use-profile';
import type { AttendanceMonthResponse } from '@/types/attendance';
import type { MobileStudent } from '@/types/auth';

const HOME_EMPTY_MESSAGE = 'Nothing to show yet. Attendance and grades will appear here.';
const HOME_GREETING_FALLBACK = 'Hi there';
const HOME_SUBTITLE = 'Here is your day at school.';
// a non-breaking space keeps the greeting line at its final height while the profile loads
const HOME_GREETING_PLACEHOLDER = '\u00a0';

function formatGreeting(student: MobileStudent | null): string {
  return student ? `Hi, ${student.first_name}` : HOME_GREETING_FALLBACK;
}

function hasAttendanceData(attendance: AttendanceMonthResponse | null): boolean {
  return attendance !== null && (attendance.days.length > 0 || countRecordedDays(attendance.summary) > 0);
}

export default function HomeScreen() {
  const profile = useProfile();
  const attendance = useAttendance();
  const grades = useGrades();

  function retryFailedSources() {
    if (attendance.errorMessage) attendance.reload();
    if (grades.errorMessage) grades.reload();
  }

  function refreshHome() {
    attendance.refresh();
    grades.refresh();
  }

  function renderHomeBody() {
    if (attendance.isLoading || grades.isLoading) return <ActivityIndicator />;
    const failureMessage = attendance.errorMessage ?? grades.errorMessage;
    if (failureMessage) {
      return <StatusMessage message={failureMessage} actionLabel="Retry" onAction={retryFailedSources} />;
    }
    if (!hasAttendanceData(attendance.attendance) && !grades.hasSubmittedGrades) {
      return <StatusMessage message={HOME_EMPTY_MESSAGE} />;
    }
    return (
      <>
        <HomeTodayCard days={attendance.attendance?.days ?? []} />
        {attendance.attendance ? <HomeMonthCard summary={attendance.attendance.summary} /> : null}
        {grades.grades ? (
          <HomeGradesCard grades={grades.grades} onViewGrades={() => router.navigate('/grades')} />
        ) : null}
      </>
    );
  }

  const { student } = profile;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={attendance.isRefreshing || grades.isRefreshing}
              onRefresh={refreshHome}
            />
          }>
          <ScreenHeader
            title={profile.isLoading ? HOME_GREETING_PLACEHOLDER : formatGreeting(student)}
            subtitle={HOME_SUBTITLE}
            trailing={
              student ? <Avatar firstName={student.first_name} lastName={student.last_name} /> : null
            }
          />
          {renderHomeBody()}
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
