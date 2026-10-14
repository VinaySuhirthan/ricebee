import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {BadgeVariant} from '../types/common';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {radii} from '../theme/spacing';

export interface AppBadgeProps {
  label: string | number;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  pill?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  pill = false,
  style,
  textStyle,
}) => {
  const variantStyles = VARIANT_MAP[variant] || VARIANT_MAP.neutral;
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        pill ? styles.pill : styles.rounded,
        isSm ? styles.badgeSm : styles.badgeMd,
        {backgroundColor: variantStyles.bg, borderColor: variantStyles.border},
        style,
      ]}>
      <Text
        style={[
          typography.badge,
          isSm ? styles.textSm : styles.textMd,
          {color: variantStyles.text},
          textStyle,
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const VARIANT_MAP: Record<
  BadgeVariant,
  {bg: string; text: string; border: string}
> = {
  primary: {
    bg: '#E8F3EE',
    text: '#1F6B4F',
    border: '#C5E2D6',
  },
  success: {
    bg: '#EAF5EE',
    text: '#2E7D4F',
    border: '#C9E6D4',
  },
  warning: {
    bg: '#FAF2E6',
    text: '#C27A12',
    border: '#EED9B8',
  },
  danger: {
    bg: '#F9ECEB',
    text: '#C0392B',
    border: '#F0C5C1',
  },
  info: {
    bg: '#EBF3F8',
    text: '#2F6F9F',
    border: '#C5DDF0',
  },
  neutral: {
    bg: '#F0F2F1',
    text: '#5E6661',
    border: '#E7E4DD',
  },
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.xs, // 4px subtle rounded status chip
  },
  pill: {
    borderRadius: radii.xs,
  },
  rounded: {
    borderRadius: radii.xs,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    minHeight: 18,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    minHeight: 20,
  },
  textSm: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
  },
  textMd: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  },
});

export default AppBadge;
