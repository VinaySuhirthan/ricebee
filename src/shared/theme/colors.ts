// Enterprise Design System Palette (Zoho Books / Linear inspired)
// Warm off-white chrome, deep rice-field green brand, muted gold accents.
// No navy, no purple, no neon, no heavy fill.

export const colors = {
  // Brand & Accents — Deep Rice-Field Green
  primary: '#1F6B4F',
  primaryHover: '#185A42',
  primaryLight: '#E8F3EE',
  primarySoft: '#E8F3EE',
  accent: '#B8862B', // Muted gold, for highlights and totals only

  // Status & Badges (Muted tones with soft tinted backgrounds)
  success: '#2E7D4F',
  successBg: '#EAF5EE',
  warning: '#C27A12',
  warningBg: '#FAF2E6',
  danger: '#C0392B',
  dangerBg: '#F9ECEB',
  info: '#2F6F9F',
  infoBg: '#EBF3F8',
  neutral: '#68716B',
  neutralBg: '#F0F2F1',

  // Chrome & Layout (Quiet, light, calm)
  appBg: '#F6F5F2', // Warm off-white
  surface: '#FFFFFF',
  headerBg: '#FFFFFF',
  headerBorder: '#E7E4DD',
  cardBg: '#FFFFFF',
  cardBgElevated: '#FFFFFF',
  cardBorder: '#E7E4DD',
  tableRowHover: '#FBFBF9',
  tableRowAlt: '#FFFFFF',

  // Sidebar (Crisp white with hairline right border, soft green active pill)
  sidebarBg: '#FFFFFF',
  sidebarHover: '#F6F5F2',
  sidebarActive: '#E8F3EE',
  sidebarActiveBorder: '#1F6B4F',
  sidebarBorder: '#E7E4DD',
  sidebarSection: '#8B938E',
  sidebarText: '#5E6661',
  sidebarTextActive: '#1F2421',

  // Typography
  textPrimary: '#1F2421',
  textSecondary: '#5E6661',
  textMuted: '#8B938E',
  textDisabled: '#A8B0AB',

  // Form Controls
  inputBg: '#FFFFFF',
  inputBorder: '#E7E4DD',
  inputFocusBorder: '#1F6B4F',
  placeholder: '#8B938E',

  // Structural & Dividers
  divider: '#E7E4DD',
  border: '#E7E4DD',
  white: '#FFFFFF',
  black: '#1F2421',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
export default colors;
