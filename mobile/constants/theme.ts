import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#94ccff';

export const VoyagerColors = {
  background: '#101418',
  surface: '#1c2024',
  surfaceLow: '#181c20',
  surfaceLowest: '#0b0f12',
  surfaceHigh: '#272a2f',
  primary: '#94ccff',
  primaryContainer: '#0077b6',
  onPrimary: '#003352',
  secondary: '#ffb781',
  onSecondary: '#4e2500',
  tertiary: '#b1f0ce',
  tertiaryContainer: '#417d61',
  onTertiary: '#003824',
  onSurface: '#e0e2e8',
  onSurfaceVariant: '#bfc7d1',
  outlineVariant: 'rgba(64, 72, 80, 0.2)',
  error: '#ffb4ab',
  destructive: '#ef4444',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    ...VoyagerColors, // Default dark mode to Voyager
    text: '#ECEDEE',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export type Vibe = 'default' | 'tropical' | 'city' | 'desert';

export function getVoyagerTheme(vibe: Vibe = 'default') {
  const base = { ...VoyagerColors };
  
  // Future Vibe Overrides (Scope)
  switch (vibe) {
    case 'tropical':
      // return { ...base, primary: '#...', tertiary: '#...' };
      return base;
    case 'desert':
      return base;
    case 'city':
      return base;
    default:
      return base;
  }
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
