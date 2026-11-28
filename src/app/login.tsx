import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { readErrorMessage } from '@/api/client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

const LOGIN_FAILED_MESSAGE = 'Could not log in. Check your connection and try again.';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [lrn, setLrn] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isIncomplete = lrn.trim() === '' || password === '';

  async function submitLogin() {
    if (isIncomplete || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await signIn(lrn.trim(), password);
    } catch (error) {
      setErrorMessage(readErrorMessage(error, LOGIN_FAILED_MESSAGE));
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.form}>
          <ThemedText type="title">MIS</ThemedText>
          <Card>
            <TextField
              label="LRN"
              value={lrn}
              onChangeText={setLrn}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errorMessage ? (
              <ThemedText type="small" themeColor="danger">
                {errorMessage}
              </ThemedText>
            ) : null}
            <PrimaryButton
              label="Log in"
              onPress={submitLogin}
              isDisabled={isIncomplete}
              isLoading={isSubmitting}
            />
          </Card>
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
  },
});
