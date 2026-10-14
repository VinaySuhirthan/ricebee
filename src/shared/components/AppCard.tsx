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
  variant?: 'default' | 'elevated' | 'accent';
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DD',
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DD',
  },
  accent: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E4DD',
    borderLeftColor: '#1F6B4F',
    borderLeftWidth: 3,
  },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md, // 8px
    borderWidth: 1,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    // Very light subtle shadow
    shadowColor: '#101814',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    color: '#1F2421',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitleText: {
    color: '#5E6661',
    fontSize: 12.5,
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
