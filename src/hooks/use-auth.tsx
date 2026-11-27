import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { ApiError, configureSessionHandlers, setAuthToken } from '@/api/client';
import { changePassword as changeStudentPassword, fetchMe, loginStudent, logoutStudent } from '@/api/mobile-auth';

const TOKEN_STORAGE_KEY = 'mis.auth-token';
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;

type AuthSession = { mustChangePassword: boolean };

type AuthContextValue = {
  isRestoring: boolean;
  isSignedIn: boolean;
  mustChangePassword: boolean;
  signIn: (lrn: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function clearStoredSession(): Promise<void> {
  setAuthToken(null);
  await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY).catch(() => undefined);
}

function isRejectedSession(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  return error.status === HTTP_UNAUTHORIZED || error.status === HTTP_NOT_FOUND;
}

async function readStoredToken(): Promise<string | null> {
  // SecureStore throws where it is unsupported (web); that means signed out
  return SecureStore.getItemAsync(TOKEN_STORAGE_KEY).catch(() => null);
}

async function loadStoredSession(): Promise<AuthSession | null> {
  const storedToken = await readStoredToken();
  if (!storedToken) return null;

  setAuthToken(storedToken);
  try {
    const meResponse = await fetchMe();
    return { mustChangePassword: meResponse.must_change_password };
  } catch (error) {
    if (!isRejectedSession(error)) return { mustChangePassword: false };
    await clearStoredSession();
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    configureSessionHandlers({
      onUnauthorized: () => {
        void clearStoredSession();
        setSession(null);
      },
      onPasswordChangeRequired: () => {
        setSession((current) => current && { mustChangePassword: true });
      },
    });

    async function restoreSession() {
      const restoredSession = await loadStoredSession();
      if (isCancelled) return;
      setSession(restoredSession);
      setIsRestoring(false);
    }
    void restoreSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function signIn(lrn: string, password: string) {
    const loginResponse = await loginStudent(lrn, password);
    setAuthToken(loginResponse.token);
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, loginResponse.token);
    setSession({ mustChangePassword: loginResponse.must_change_password });
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await changeStudentPassword(currentPassword, newPassword);
    setSession({ mustChangePassword: false });
  }

  async function signOut() {
    // logout must always succeed locally, even when the token is already revoked or the network is down
    await logoutStudent().catch(() => undefined);
    await clearStoredSession();
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isRestoring,
        isSignedIn: session !== null,
        mustChangePassword: session?.mustChangePassword ?? false,
        signIn,
        changePassword,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('useAuth must be used inside AuthProvider');
  return authContext;
}
