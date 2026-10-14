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
    text: colors.primary,
    border: 'rgba(21, 101, 192, 0.3)',
  },
  success: {
    bg: colors.successBg,
    text: colors.success,
    border: 'rgba(46, 125, 50, 0.3)',
  },
  warning: {
    bg: colors.warningBg,
    text: colors.warning,
    border: 'rgba(230, 81, 0, 0.3)',
  },
  danger: {
    bg: colors.dangerBg,
    text: colors.danger,
    border: 'rgba(198, 40, 40, 0.3)',
  },
  info: {
    bg: colors.infoBg,
    text: colors.info,
    border: 'rgba(2, 119, 189, 0.3)',
  },
  neutral: {
    bg: colors.neutralBg,
    text: colors.neutral,
    border: 'rgba(96, 125, 139, 0.3)',
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
