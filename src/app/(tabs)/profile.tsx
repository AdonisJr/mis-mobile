import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppearanceSelector } from '@/components/appearance-selector';
import { StatusMessage } from '@/components/status-message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppearance } from '@/hooks/use-appearance';
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
  const { preference, saveErrorMessage, setPreference } = useAppearance();
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
      <Card>
        <DetailRow label="Name" value={formatStudentName(student)} />
        <DetailRow label="LRN" value={student.lrn} />
        <DetailRow label="Grade level" value={student.grade_level?.name ?? NOT_ENROLLED_TEXT} />
        <DetailRow label="Section" value={student.section?.name ?? NOT_ENROLLED_TEXT} />
        <DetailRow label="School year" value={student.school_year?.name ?? NOT_ENROLLED_TEXT} />
      </Card>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader
            title="Profile"
            trailing={
              student ? <Avatar firstName={student.first_name} lastName={student.last_name} /> : null
            }
          />
          {renderProfileBody()}
          <Card>
            <ThemedText type="smallBold">Appearance</ThemedText>
            <AppearanceSelector value={preference} onSelect={setPreference} />
            {saveErrorMessage ? (
              <ThemedText type="small" themeColor="danger">
                {saveErrorMessage}
              </ThemedText>
            ) : null}
          </Card>
          <SecondaryButton label="Change password" onPress={() => router.push('/change-password')} />
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
  detailRow: {
    gap: Spacing.half,
  },
});
