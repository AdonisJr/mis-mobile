import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import type { MobileStudent } from '@/types/auth';

const NOT_ENROLLED_TEXT = 'Not enrolled';

function formatStudentName(student: MobileStudent): string {
  return [student.first_name, student.middle_name, student.last_name]
    .filter((namePart) => namePart !== null)
    .join(' ');
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText>{value}</ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const { student, errorMessage, isLoading, reload } = useProfile();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function submitLogout() {
    setIsSigningOut(true);
    await signOut();
  }

  function renderProfileBody() {
    if (isLoading) return <ActivityIndicator />;
    if (errorMessage || !student) {
      return <StatusMessage message={errorMessage ?? ''} actionLabel="Retry" onAction={reload} />;
    }
    return (
      <ThemedView type="backgroundElement" style={styles.details}>
        <DetailRow label="Name" value={formatStudentName(student)} />
        <DetailRow label="LRN" value={student.lrn} />
        <DetailRow label="Grade level" value={student.grade_level?.name ?? NOT_ENROLLED_TEXT} />
        <DetailRow label="Section" value={student.section?.name ?? NOT_ENROLLED_TEXT} />
        <DetailRow label="School year" value={student.school_year?.name ?? NOT_ENROLLED_TEXT} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Profile</ThemedText>
          {renderProfileBody()}
          <PrimaryButton label="Change password" onPress={() => router.push('/change-password')} />
          <PrimaryButton label="Log out" onPress={submitLogout} isLoading={isSigningOut} />
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
  details: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  detailRow: {
    gap: Spacing.half,
  },
});
