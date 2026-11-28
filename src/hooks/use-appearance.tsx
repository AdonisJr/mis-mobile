import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Appearance, Platform, type ColorSchemeName } from 'react-native';

import { useDeviceColorScheme } from '@/hooks/use-device-color-scheme';
import type { AppearancePreference, ResolvedScheme } from '@/types/appearance';

export const APPEARANCE_STORAGE_KEY = 'mis.appearance';
export const APPEARANCE_PREFERENCES: AppearancePreference[] = ['system', 'light', 'dark'];
export const APPEARANCE_SAVE_ERROR = 'Could not save your appearance choice. Try again.';
const SYSTEM_SCHEME_OVERRIDE = 'unspecified';

type AppearanceContextValue = {
  preference: AppearancePreference;
  resolvedScheme: ResolvedScheme;
  saveErrorMessage: string | null;
  setPreference: (preference: AppearancePreference) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function parseStoredPreference(storedValue: string | null): AppearancePreference {
  const matchingPreference = APPEARANCE_PREFERENCES.find((preference) => preference === storedValue);
  return matchingPreference ?? 'system';
}

function resolveScheme(
  preference: AppearancePreference,
  deviceScheme: ColorSchemeName | null | undefined,
): ResolvedScheme {
  if (preference !== 'system') return preference;
  return deviceScheme === 'dark' ? 'dark' : 'light';
}

async function readStoredPreference(): Promise<AppearancePreference> {
  // SecureStore throws where it is unsupported (web); that means System
  const storedValue = await SecureStore.getItemAsync(APPEARANCE_STORAGE_KEY).catch(() => null);
  return parseStoredPreference(storedValue);
}

async function writeStoredPreference(preference: AppearancePreference): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(APPEARANCE_STORAGE_KEY, preference);
    return true;
  } catch {
    return false;
  }
}

function applyNativeScheme(preference: AppearancePreference) {
  if (Platform.OS === 'web') return;
  Appearance.setColorScheme(preference === 'system' ? SYSTEM_SCHEME_OVERRIDE : preference);
}

export function AppearanceProvider({ children }: PropsWithChildren) {
  const deviceScheme = useDeviceColorScheme();
  // null = the stored value has not been read yet
  const [preference, setPreferenceState] = useState<AppearancePreference | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const savedPreferenceRef = useRef<AppearancePreference>('system');
  const pendingWriteRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let isCancelled = false;
    async function loadPreference() {
      const storedPreference = await readStoredPreference();
      if (isCancelled) return;
      savedPreferenceRef.current = storedPreference;
      setPreferenceState((current) => current ?? storedPreference);
    }
    void loadPreference();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (preference === null) return;
    applyNativeScheme(preference);
  }, [preference]);

  async function saveSelection(selectedPreference: AppearancePreference) {
    const isSaved = await writeStoredPreference(selectedPreference);
    if (isSaved) {
      savedPreferenceRef.current = selectedPreference;
      return;
    }
    setPreferenceState(savedPreferenceRef.current);
    setSaveErrorMessage(APPEARANCE_SAVE_ERROR);
  }

  function setPreference(selectedPreference: AppearancePreference) {
    setPreferenceState(selectedPreference);
    setSaveErrorMessage(null);
    // writes are chained so the last tap is the value saved; a failed write reverts to the last saved value
    pendingWriteRef.current = pendingWriteRef.current.then(() => saveSelection(selectedPreference));
  }

  if (preference === null) return null;

  return (
    <AppearanceContext.Provider
      value={{
        preference,
        resolvedScheme: resolveScheme(preference, deviceScheme),
        saveErrorMessage,
        setPreference,
      }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const appearanceContext = useContext(AppearanceContext);
  if (!appearanceContext) throw new Error('useAppearance must be used inside AppearanceProvider');
  return appearanceContext;
}
