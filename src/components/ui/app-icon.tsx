import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AppIconName = 'home' | 'grades' | 'attendance' | 'profile' | 'previous' | 'next';

type AppIconSymbol = { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol };

const DEFAULT_ICON_SIZE = 24;

const APP_ICON_SYMBOLS: Record<AppIconName, AppIconSymbol> = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  grades: { ios: 'graduationcap.fill', android: 'school', web: 'school' },
  attendance: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  profile: { ios: 'person.crop.circle', android: 'person', web: 'person' },
  previous: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  next: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
};

export type AppIconProps = { name: AppIconName; color: ThemeColor; size?: number };

export function AppIcon({ name, color, size = DEFAULT_ICON_SIZE }: AppIconProps) {
  const theme = useTheme();

  return <SymbolView name={APP_ICON_SYMBOLS[name]} tintColor={theme[color]} size={size} />;
}
