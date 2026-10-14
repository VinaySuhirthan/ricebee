import React from 'react';
import {Text, StyleSheet, TextStyle, Platform} from 'react-native';
import {IconName} from '../types/common';
import {colors} from '../theme/colors';

interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// Enterprise line icon mapping (Segoe MDL2 Assets glyphs & pure monochrome symbols)
// Zero emoji, zero multicolor fills, 100% monochrome stroke
const LINE_ICON_MAP: Record<IconName, string> = {
  dashboard: '\uE80F', // Home / Grid
  search: '\uE721', // Magnifying glass line
  customers: '\uE77B', // People outline
  orders: '\uE7C3', // Order list outline
  billing: '\uE8A1', // Receipt outline
  invoices: '\uE8A5', // Document line
  payments: '\uE8C7', // Payment card outline
  followups: '\uE787', // Calendar outline
  whatsapp: '\uE8BD', // Message bubble outline
  returns: '\uE7A7', // Back curved arrow outline
  scale: '\uE91B', // Weigh scale line
  products: '\uE8F1', // Box package outline
  notifications: '\uEA8F', // Bell line
  activity: '\uE916', // Stop-watch line
  plus: '\uE710', // Plus line
  filter: '\uE71C', // Filter funnel line
  refresh: '\uE72C', // Sync arrow
  download: '\uE896', // Download arrow
  settings: '\uE713', // Gear outline
  user: '\uE77B', // User outline
  calendar: '\uE787', // Calendar
  check: '\uE73E', // Checkmark
  close: '\uE711', // Cross mark
  'arrow-right': '\uE72A', // Right arrow
  'arrow-left': '\uE72B', // Left arrow
  'trending-up': '\uE8A7', // Up chart
  'trending-down': '\uE8A9', // Down chart
  clock: '\uE916', // Clock outline
  currency: '₹', // Rupee symbol
  offline: '\uE8A1', // Receipt POS
  online: '\uE774', // Globe outline
  print: '\uE749', // Printer outline
};

// Fallback Unicode clean stroke symbols for non-windows environments
const FALLBACK_LINE_MAP: Record<IconName, string> = {
  dashboard: '⊞',
  search: '⌕',
  customers: '⚲',
  orders: '☰',
  billing: '📄',
  invoices: '☷',
  payments: '⌸',
  followups: '◷',
  whatsapp: '💬',
  returns: '↩',
  scale: '⚖',
  products: '◫',
  notifications: '⌖',
  activity: '⏱',
  plus: '+',
  filter: '⚚',
  refresh: '↻',
  download: '↓',
  settings: '⚙',
  user: '○',
  calendar: '◷',
  check: '✓',
  close: '✕',
  'arrow-right': '→',
  'arrow-left': '←',
  'trending-up': '↗',
  'trending-down': '↘',
  clock: '◷',
  currency: '₹',
  offline: '⌸',
  online: '◎',
  print: '⎙',
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 16,
  color = colors.textSecondary,
  style,
}) => {
  const isWindows = Platform.OS === 'windows';
  const glyph = isWindows
    ? LINE_ICON_MAP[name] || FALLBACK_LINE_MAP[name] || '•'
    : FALLBACK_LINE_MAP[name] || '•';

  return (
    <Text
      accessible={false}
      style={[
        styles.icon,
        {
          fontSize: size,
          lineHeight: size * 1.15,
          color,
          width: size,
          height: size,
          textAlign: 'center',
        },
        style,
      ]}>
      {glyph}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontFamily: Platform.select({
      windows: 'Segoe MDL2 Assets, Segoe Fluent Icons, Segoe UI Symbol',
      default: 'system-ui',
    }),
    fontWeight: '400',
  },
});

export default AppIcon;
