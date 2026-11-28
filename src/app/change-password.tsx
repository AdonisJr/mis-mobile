import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { readErrorMessage } from '@/api/client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_CHANGE_FAILED_MESSAGE = 'Could not change your password.';
const PASSWORD_TOO_SHORT_MESSAGE = 'The new password must be at least 8 characters.';
const PASSWORD_MISMATCH_MESSAGE = 'The new passwords do not match.';

function findPasswordProblem(newPassword: string, confirmPassword: string): string | null {
  if (newPassword.length < PASSWORD_MIN_LENGTH) return PASSWORD_TOO_SHORT_MESSAGE;
  if (newPassword !== confirmPassword) return PASSWORD_MISMATCH_MESSAGE;
  return null;
}

export default function ChangePasswordScreen() {
  const { mustChangePassword, changePassword, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasChanged, setHasChanged] = useState(false);

  if (hasChanged && !mustChangePassword) return <Redirect href="/" />;

  async function submitPasswordChange() {
    const passwordProblem = findPasswordProblem(newPassword, confirmPassword);
    if (passwordProblem) {
      setErrorMessage(passwordProblem);
      return;
    }
    const wasForced = mustChangePassword;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await changePassword(currentPassword, newPassword);
    } catch (error) {
      setErrorMessage(readErrorMessage(error, PASSWORD_CHANGE_FAILED_MESSAGE));
      setIsSubmitting(false);
      return;
    }
    if (wasForced) {
      setHasChanged(true);
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <ThemedText type="subtitle">Change password</ThemedText>
            {mustChangePassword ? (
              <ThemedText themeColor="textSecondary">
                You must change your temporary password before continuing.
              </ThemedText>
            ) : null}
            <Card>
              <TextField
                label="Current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <TextField
                label="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <TextField
                label="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              {errorMessage ? (
                <ThemedText type="small" themeColor="danger">
                  {errorMessage}
                </ThemedText>
              ) : null}
              <PrimaryButton
                label="Change password"
                onPress={submitPasswordChange}
                isDisabled={currentPassword === '' || newPassword === '' || confirmPassword === ''}
                isLoading={isSubmitting}
              />
              <SecondaryButton
                label={mustChangePassword ? 'Log out' : 'Cancel'}
                onPress={mustChangePassword ? signOut : () => router.back()}
              />
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
  },
  form: {
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
});
