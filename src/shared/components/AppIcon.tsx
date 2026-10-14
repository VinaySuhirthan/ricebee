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

const ICON_MAP: Record<IconName, string> = {
  dashboard: '⊞',
  search: '🔍',
  customers: '👥',
  orders: '📋',
  billing: '🧾',
  invoices: '📄',
  payments: '💳',
  followups: '📅',
  whatsapp: '💬',
  returns: '↩',
  scale: '⚖',
  products: '📦',
  notifications: '🔔',
  activity: '⏱',
  plus: '＋',
  filter: '⚙',
  refresh: '↻',
  download: '⤓',
  settings: '⚙',
  user: '👤',
  calendar: '📅',
  check: '✓',
  close: '✕',
  'arrow-right': '→',
  'arrow-left': '←',
  'trending-up': '↗',
  'trending-down': '↘',
  clock: '🕒',
  currency: '₹',
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 16,
  color = colors.textPrimary,
  style,
}) => {
  const glyph = ICON_MAP[name] || '•';

  return (
    <Text
      accessible={false}
      style={[
        styles.icon,
        {
          fontSize: size,
          lineHeight: size * 1.25,
          color,
          width: size * 1.4,
          height: size * 1.25,
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
      windows: 'Segoe UI Symbol, Segoe UI Emoji, Segoe UI',
      default: 'System',
    }),
  },
});

export default AppIcon;
