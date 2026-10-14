import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {radii, spacing} from '../theme/spacing';

export interface AppCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'accent';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  title,
  subtitle,
  action,
  variant = 'default',
  style,
  contentStyle,
}) => {
  const hasHeader = !!title || !!subtitle || !!action;

  return (
    <View style={[styles.card, VARIANT_STYLES[variant], style]}>
      {hasHeader && (
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            {title && (
              <Text style={[typography.h3, styles.titleText]}>{title}</Text>
            )}
            {subtitle && (
              <Text style={[typography.caption, styles.subtitleText]}>
                {subtitle}
              </Text>
            )}
          </View>
          {action && <View style={styles.actionContainer}>{action}</View>}
        </View>
      )}
      <View style={[styles.cardBody, contentStyle]}>{children}</View>
    </View>
  );
};

const VARIANT_STYLES = StyleSheet.create({
  default: {
    backgroundColor: colors.cardBg,
    borderColor: colors.cardBorder,
  },
  elevated: {
    backgroundColor: colors.cardBgElevated,
    borderColor: colors.cardBorder,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: colors.cardBorder,
  },
  accent: {
    backgroundColor: colors.cardBg,
    borderColor: colors.primary,
    borderLeftWidth: 3,
  },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    // Subtle white-card shadow for Zoho-like elevation
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  subtitleText: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionContainer: {
    marginLeft: spacing.md,
  },
  cardBody: {
    flex: 1,
  },
});

export default AppCard;
