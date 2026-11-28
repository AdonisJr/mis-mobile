import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { AppearanceProvider } from '@/hooks/use-appearance';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

const NAVIGATION_THEMES = {
  light: {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: Colors.light.background },
  },
  dark: {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: Colors.dark.background },
  },
};

function RootStack() {
  const { isRestoring, isSignedIn, mustChangePassword } = useAuth();
  if (isRestoring) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn && !mustChangePassword}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="change-password" />
      </Stack.Protected>
    </Stack>
  );
}

function ThemedRoot() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={NAVIGATION_THEMES[colorScheme]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootStack />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppearanceProvider>
      <ThemedRoot />
    </AppearanceProvider>
  );
}
