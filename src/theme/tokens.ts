// Design tokens — "Cinematic Pulse" design system (see DESIGN.md).
// Values mirror the DESIGN.md frontmatter; px strings are converted to RN numbers.

export const colors = {
  surface: '#10131a',
  surfaceDim: '#10131a',
  surfaceBright: '#363940',
  surfaceContainerLowest: '#0b0e14',
  surfaceContainerLow: '#191c22',
  surfaceContainer: '#1d2026',
  surfaceContainerHigh: '#272a31',
  surfaceContainerHighest: '#32353c',
  surfaceVariant: '#32353c',
  onSurface: '#e1e2eb',
  onSurfaceVariant: '#e2bfb0',
  outline: '#a98a7d',
  outlineVariant: '#5a4136',

  // Electric Orange — primary actions, play buttons, "New" badges.
  primary: '#ffb693',
  onPrimary: '#561f00',
  primaryContainer: '#ff6b00',
  onPrimaryContainer: '#572000',

  // Neon Indigo — metadata, progress, accents.
  secondary: '#c0c1ff',
  onSecondary: '#1000a9',
  secondaryContainer: '#3131c0',
  onSecondaryContainer: '#b0b2ff',

  tertiary: '#9ccaff',
  onTertiary: '#003257',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',

  background: '#10131a',
  onBackground: '#e1e2eb',
} as const;

// Translucent fills for the glass surface strategy (white-tinted alpha over the dark base).
export const glass = {
  level2Fill: 'rgba(255,255,255,0.10)',
  level2Border: 'rgba(255,255,255,0.10)',
  level3Fill: 'rgba(255,255,255,0.15)',
} as const;

export const radii = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  base: 8,
  gutter: 16,
  marginMobile: 16,
  marginDesktop: 48,
  stackSm: 4,
  stackMd: 12,
  stackLg: 24,
} as const;

// fontFamily values use each static font's PostScript name, which also matches
// the bundled filename — so the same string resolves on both iOS and Android.
export const typography = {
  displayLg: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: -1,
  },
  displayLgMobile: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.64,
  },
  headlineMd: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  bodyLg: {
    fontFamily: 'Inter18pt-Regular',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: 'Inter18pt-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  labelSm: {
    fontFamily: 'Inter18pt-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.6,
  },
} as const;

// "Snappy yet smooth" timing for animated transitions.
export const motion = {
  easing: [0.4, 0, 0.2, 1] as const,
} as const;
