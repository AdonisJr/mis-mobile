import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#121212',
    textSecondary: '#5E5E58',
    background: '#F4F4F0',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8E8E2',
    accent: '#D4F53C',
    onAccent: '#121212',
    danger: '#B42318',
    border: '#8A8A84',
    track: '#E4E4DE',
    graphic: '#4D6B00',
    tabBar: '#1C1C1E',
    tabBarIcon: '#B8B8B2',
    statusPresentBackground: '#E6F7B0',
    statusPresentText: '#3A5200',
    statusLateBackground: '#FFF0C2',
    statusLateText: '#7A4D00',
    statusTimedOutBackground: '#ECECE8',
    statusTimedOutText: '#45453F',
  },
  dark: {
    text: '#F5F5F2',
    textSecondary: '#A3A3A0',
    background: '#0B0B0C',
    backgroundElement: '#1A1A1C',
    backgroundSelected: '#2A2A2D',
    accent: '#D4F53C',
    onAccent: '#0B0B0C',
    danger: '#FF7A6B',
    border: '#6E6E73',
    track: '#3A3A3E',
    graphic: '#D4F53C',
    tabBar: '#1F1F22',
    tabBarIcon: '#A3A3A0',
    statusPresentBackground: '#2B3A12',
    statusPresentText: '#D4F53C',
    statusLateBackground: '#3D2E0F',
    statusLateText: '#FFC857',
    statusTimedOutBackground: '#2E2E32',
    statusTimedOutText: '#D6D6D1',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { chip: 12, field: 16, card: 24, pill: 999 } as const;
export const TouchTarget = 44;
export const PillButtonHeight = 52;
export const StatFont = { fontSize: 40, lineHeight: 46 } as const;
export const GaugeValueFont = { fontSize: 32, lineHeight: 38 } as const;
export const TabBarItemSize = 52;
export const TabBarHeight = TabBarItemSize + Spacing.two * 2;
export const BottomTabInset = TabBarHeight + Spacing.three;
// matches the app.json splash colour so the overlay hands off to the native splash without a flash
export const SplashBackground = '#208AEF';
export const MaxContentWidth = 800;
