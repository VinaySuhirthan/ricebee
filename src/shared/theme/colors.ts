export const colors = {
  // Brand & Accents
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryLight: 'rgba(37, 99, 235, 0.12)',
  accent: '#06B6D4',

  // Status & Badges
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.15)',
  neutral: '#64748B',
  neutralBg: 'rgba(100, 116, 139, 0.15)',

  // Desktop CRM Dark Navy Palette
  sidebarBg: '#091122',
  sidebarHover: '#131F37',
  sidebarActive: '#1A2949',
  sidebarBorder: '#16233B',
  sidebarSection: '#64748B',
  sidebarText: '#94A3B8',
  sidebarTextActive: '#FFFFFF',

  // Main Canvas
  appBg: '#0A0E1A',
  headerBg: '#0D1527',
  headerBorder: '#1E293B',
  cardBg: '#131C31',
  cardBgElevated: '#18243E',
  cardBorder: '#1E2F4D',
  tableRowHover: '#17233B',
  tableRowAlt: '#0F1829',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',

  // Form Controls
  inputBg: '#0F172A',
  inputBorder: '#27354F',
  inputFocusBorder: '#3B82F6',
  placeholder: '#475569',

  // System
  divider: '#1E293B',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
