export type ThemeMode = 'paper' | 'sepia' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  surface: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  tertiaryFixed: string;
  success: string;
  dockBackground: string;
  tagBackground: string;
  tagText: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  // Modo Papel (Día) - Idéntico a la paleta del HTML interactivo
  paper: {
    background: '#FBF8FF',
    card: '#FFFFFF',
    surface: '#FBF8FF',
    surfaceContainerLow: '#F4F2FD',
    surfaceContainer: '#EEEDF7',
    surfaceContainerHigh: '#E8E7F1',
    surfaceContainerHighest: '#E3E1EC',
    border: '#E8E5DC',
    text: '#1A1B22',
    textSecondary: '#434655',
    textMuted: '#747686',
    primary: '#0037B0',
    primaryContainer: '#1D4ED8',
    onPrimaryContainer: '#CAD3FF',
    secondary: '#515F74',
    secondaryContainer: '#D5E3FC',
    onSecondaryContainer: '#57657A',
    tertiary: '#6B3700',
    tertiaryContainer: '#8D4B00',
    tertiaryFixed: '#FFDCC3',
    success: '#10B981',
    dockBackground: 'rgba(255, 255, 255, 0.95)',
    tagBackground: '#D5E3FC',
    tagText: '#0D1C2E',
  },
  // Modo Sepia (Cálido y reposado)
  sepia: {
    background: '#F5EEDB',
    card: '#FAF4E8',
    surface: '#F5EEDB',
    surfaceContainerLow: '#EFE6CE',
    surfaceContainer: '#EAE1CC',
    surfaceContainerHigh: '#E2D8C0',
    surfaceContainerHighest: '#DAD0B8',
    border: '#DDD1B8',
    text: '#27272A',
    textSecondary: '#5C5446',
    textMuted: '#8C8270',
    primary: '#B45309',
    primaryContainer: '#92400E',
    onPrimaryContainer: '#FEF3C7',
    secondary: '#78350F',
    secondaryContainer: '#FDE68A',
    onSecondaryContainer: '#451A03',
    tertiary: '#B45309',
    tertiaryContainer: '#D97706',
    tertiaryFixed: '#FEF3C7',
    success: '#059669',
    dockBackground: 'rgba(250, 244, 232, 0.95)',
    tagBackground: '#FDE68A',
    tagText: '#92400E',
  },
  // Modo Noche (OLED Puro)
  dark: {
    background: '#09090B',
    card: '#18181B',
    surface: '#09090B',
    surfaceContainerLow: '#121214',
    surfaceContainer: '#1E1E22',
    surfaceContainerHigh: '#27272A',
    surfaceContainerHighest: '#323238',
    border: '#27272A',
    text: '#F4F4F5',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    primary: '#3B82F6',
    primaryContainer: '#1D4ED8',
    onPrimaryContainer: '#CAD3FF',
    secondary: '#94A3B8',
    secondaryContainer: '#1E293B',
    onSecondaryContainer: '#E2E8F0',
    tertiary: '#F59E0B',
    tertiaryContainer: '#D97706',
    tertiaryFixed: '#451A03',
    success: '#10B981',
    dockBackground: 'rgba(24, 24, 27, 0.95)',
    tagBackground: '#1E293B',
    tagText: '#93C5FD',
  },
};
