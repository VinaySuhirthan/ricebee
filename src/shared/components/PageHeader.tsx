import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumb,
  actions,
  badge,
  style,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      {breadcrumb && breadcrumb.length > 0 && (
        <View style={styles.breadcrumbRow}>
          {breadcrumb.map((crumb, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            return (
              <React.Fragment key={crumb}>
                <Text
                  style={[
                    typography.caption,
                    isLast
                      ? styles.breadcrumbActive
                      : styles.breadcrumbInactive,
                  ]}>
                  {crumb}
                </Text>
                {!isLast && <Text style={styles.breadcrumbSep}> / </Text>}
              </React.Fragment>
            );
          })}
        </View>
      )}

      <View style={styles.mainRow}>
        <View style={styles.titleArea}>
          <View style={styles.titleBadgeRow}>
            <Text style={[typography.h1, styles.titleText]}>{title}</Text>
            {badge && <View style={styles.badgeWrapper}>{badge}</View>}
          </View>
          {description && (
            <Text style={[typography.body, styles.descText]}>
              {description}
            </Text>
          )}
        </View>

        {actions && <View style={styles.actionsArea}>{actions}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  breadcrumbInactive: {
    color: colors.textMuted,
  },
  breadcrumbActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  breadcrumbSep: {
    color: colors.textMuted,
    fontSize: 11,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  titleArea: {
    flex: 1,
    minWidth: 260,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: 22,
    letterSpacing: -0.2,
  },
  badgeWrapper: {
    marginLeft: spacing.sm,
  },
  descText: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

export default PageHeader;
