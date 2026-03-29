// Design system — matches the game's visual identity:
// Deep navy-black base, electric cyan circuit-board glow, gold accents.

export const C = {
  // Backgrounds
  bgDeep:    '#060d1a',
  bgSurface: '#091624',
  bgCard:    '#0b1c30',
  bgInput:   '#050c17',
  bgMid:     '#0d1e30',

  // Accents
  gold:      '#d4a827',
  goldDim:   'rgba(212,168,39,0.45)',
  goldGlow:  'rgba(212,168,39,0.22)',
  cyan:      '#00c4e4',
  cyanDim:   'rgba(0,196,228,0.4)',
  cyanGlow:  'rgba(0,196,228,0.15)',
  orange:    '#e07828',

  // Text
  textPrimary:   '#e8dfc8',
  textSecondary: '#6080a0',
  textMuted:     '#3d5570',

  // Misc
  green:    '#2e8a58',
  greenDim: '#1a5038',
  borderSub: '#142030',
  red:      '#8b2020',
};

// Glow shadow helpers — use as spread into StyleSheet objects
export const GoldGlow = {
  shadowColor:  '#d4a827',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.7,
  shadowRadius:  8,
  elevation: 6,
};

export const CyanGlow = {
  shadowColor:  '#00c4e4',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius:  8,
  elevation: 5,
};
