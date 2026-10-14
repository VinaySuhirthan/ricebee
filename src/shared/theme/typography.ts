import {Platform, TextStyle} from 'react-native';

const fontFamily = Platform.select({
  windows: 'Segoe UI, Inter, -apple-system, sans-serif',
  ios: 'Inter, -apple-system, sans-serif',
  android: 'sans-serif',
  default: 'Segoe UI, Inter, -apple-system, sans-serif',
});

export const typography = {
  // Page Titles (20-24px, weight 600)
  h1: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    color: '#1F2421',
  } as TextStyle,

  // Section Headers (16-18px, weight 600)
  h2: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: '#1F2421',
  } as TextStyle,

  // Subsections / Card Headers (15-16px, weight 600)
  h3: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1F2421',
  } as TextStyle,

  // Body Base (14px, weight 400)
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#1F2421',
  } as TextStyle,

  // Body Medium (14px, weight 500)
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#1F2421',
  } as TextStyle,

  // Body Semibold (14px, weight 600)
  bodyBold: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1F2421',
  } as TextStyle,

  // Body Small (13px, weight 400/500)
  bodySmall: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: '#5E6661',
  } as TextStyle,

  // Field Labels (12-13px, weight 500, secondary color)
  label: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 16,
    color: '#5E6661',
  } as TextStyle,

  // Captions & Secondary Text (12px, weight 400)
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#8B938E',
  } as TextStyle,

  captionMedium: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#5E6661',
  } as TextStyle,

  // Sidebar Group Headings (11px, letter-spacing 0.8, muted uppercase)
  sectionHeading: {
    fontFamily,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#8B938E',
  } as TextStyle,

  // Table Column Headers (11.5px, weight 600, muted uppercase)
  th: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#5E6661',
  } as TextStyle,

  // Status Chips & Badges (11px, weight 500)
  badge: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  } as TextStyle,

  // Tabular Numbers (For money, quantities, weight, rates)
  tabularNumber: {
    fontFamily,
    fontSize: 13.5,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    color: '#1F2421',
  } as TextStyle,

  tabularNumberBold: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: '#1F2421',
  } as TextStyle,

  // Key Grand Total Amount (Prominent, clean)
  grandTotalNumber: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
    color: '#1F6B4F', // Primary green
  } as TextStyle,
} as const;

export default typography;
