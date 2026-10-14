// Zoho CRM-inspired light theme palette
export const colors = {
  // Brand & Accents — Zoho blue
  primary: '#1565C0',
  primaryHover: '#0D47A1',
  primaryLight: 'rgba(21, 101, 192, 0.10)',
  accent: '#0288D1',

  // Status & Badges
  success: '#2E7D32',
  successBg: 'rgba(46, 125, 50, 0.10)',
  warning: '#E65100',
  warningBg: 'rgba(230, 81, 0, 0.10)',
  danger: '#C62828',
  dangerBg: 'rgba(198, 40, 40, 0.10)',
  info: '#0277BD',
  infoBg: 'rgba(2, 119, 189, 0.10)',
  neutral: '#607D8B',
  neutralBg: 'rgba(96, 125, 139, 0.10)',

  // Left Sidebar — stays dark navy (Zoho CRM pattern)
  sidebarBg: '#1A2745',
  sidebarHover: '#243354',
  sidebarActive: '#2D4068',
  sidebarBorder: '#243354',
  sidebarSection: '#6B7FA8',
  sidebarText: '#A8B8D8',
  sidebarTextActive: '#FFFFFF',

  // Main Canvas — white/light (Zoho CRM content area)
  appBg: '#F0F2F5',
  headerBg: '#FFFFFF',
  headerBorder: '#E2E8F0',
  cardBg: '#FFFFFF',
  cardBgElevated: '#FAFBFF',
  cardBorder: '#E2E8F0',
  tableRowHover: '#F5F7FA',
  tableRowAlt: '#FAFBFF',

  // Text
  textPrimary: '#1A2745',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textDisabled: '#A0AEC0',

  // Form Controls
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E0',
  inputFocusBorder: '#1565C0',
  placeholder: '#A0AEC0',

  // System
  divider: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
