import {Platform, TextStyle} from 'react-native';

const fontFamily = Platform.select({
  windows: 'Segoe UI',
  ios: 'System',
  android: 'sans-serif',
  default: 'Segoe UI, Roboto, -apple-system, sans-serif',
});

export const typography = {
  h1: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  } as TextStyle,
  h2: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,
  h3: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,
  bodyBold: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,
  captionMedium: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  } as TextStyle,
  sectionHeading: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  } as TextStyle,
  badge: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  } as TextStyle,
} as const;
