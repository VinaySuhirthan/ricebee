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
  pill = true,
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
    bg: colors.primaryLight,
    text: '#60A5FA',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  success: {
    bg: colors.successBg,
    text: '#34D399',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  warning: {
    bg: colors.warningBg,
    text: '#FBBF24',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  danger: {
    bg: colors.dangerBg,
    text: '#F87171',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  info: {
    bg: colors.infoBg,
    text: '#38BDF8',
    border: 'rgba(56, 189, 248, 0.3)',
  },
  neutral: {
    bg: colors.neutralBg,
    text: '#94A3B8',
    border: 'rgba(148, 163, 184, 0.25)',
  },
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    borderRadius: radii.full,
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
    paddingVertical: 3,
    minHeight: 22,
  },
  textSm: {
    fontSize: 10,
    lineHeight: 12,
  },
  textMd: {
    fontSize: 11,
    lineHeight: 14,
  },
});

export default AppBadge;
