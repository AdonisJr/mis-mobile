import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AttendanceDayRow } from '@/components/attendance-day-row';
import { AttendanceSummaryBlock } from '@/components/attendance-summary-block';
import { MonthSwitcher } from '@/components/month-switcher';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ATTENDANCE_EMPTY_MESSAGE, useAttendance } from '@/hooks/use-attendance';

export default function AttendanceScreen() {
  const {
    attendance,
    selectedMonth,
    errorMessage,
    isLoading,
    isRefreshing,
    canSelectNextMonth,
    selectPreviousMonth,
    selectNextMonth,
    reload,
    refresh,
  } = useAttendance();

  function renderDayRows() {
    if (attendance === null || attendance.days.length === 0) {
      return <StatusMessage message={ATTENDANCE_EMPTY_MESSAGE} />;
    }
    return attendance.days.map((day) => <AttendanceDayRow key={day.id} day={day} />);
  }

  function renderAttendanceBody() {
    if (isLoading) return <ActivityIndicator />;
    if (errorMessage) {
      return <StatusMessage message={errorMessage} actionLabel="Retry" onAction={reload} />;
    }
    if (!attendance) return <StatusMessage message={ATTENDANCE_EMPTY_MESSAGE} />;
    return (
      <>
        <AttendanceSummaryBlock summary={attendance.summary} />
        {renderDayRows()}
      </>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
          <ThemedText type="subtitle">Attendance</ThemedText>
          {selectedMonth ? (
            <MonthSwitcher
              month={selectedMonth}
              canSelectNext={canSelectNextMonth}
              onSelectPrevious={selectPreviousMonth}
              onSelectNext={selectNextMonth}
            />
          ) : null}
          {renderAttendanceBody()}
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
