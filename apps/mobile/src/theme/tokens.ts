/**
 * Design tokens (build brief Section 12). One source of truth for color,
 * type, spacing and radius so every screen reads as the same app - don't
 * add ad hoc colors/sizes in a screen, add a token here instead.
 */

export const colors = {
  // Accent: reserved for cost-effectiveness callouts and primary actions.
  accent: '#0F6E56',
  accentTint: '#E1F5EE',

  // Warning/stale: stale prices and unverified/community nutrition data.
  warning: '#EF9F27',
  warningTint: '#FAEEDA',

  // Light surfaces (dashboard, settings, most screens).
  background: '#F2EFE6',
  surface: '#FFFFFF',
  surfaceMuted: '#ECE7DA',
  border: '#E3DFD3',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',

  // Dark surface (live scan screen only - camera feed backdrop).
  scanBackground: '#1B1B1B',
  textOnDark: '#FFFFFF',
  textOnDarkSecondary: 'rgba(255, 255, 255, 0.7)',
  borderOnDark: 'rgba(255, 255, 255, 0.9)',

  neutralTint: '#EDEDED',
  neutralText: '#5A5A5A',
} as const;

export const typography = {
  screenTitle: { fontSize: 20, fontWeight: '600' as const },
  cardLabel: { fontSize: 15, fontWeight: '500' as const },
  supporting: { fontSize: 13, fontWeight: '400' as const },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radii = {
  card: 12,
  pill: 999,
} as const;
