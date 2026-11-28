/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // RN 0.88 returns null when no scheme is set, so anything but dark falls back to light
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}
