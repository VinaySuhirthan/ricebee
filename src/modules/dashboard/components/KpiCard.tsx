import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DashboardKpi} from '../types';
import {colors} from '../../../shared/theme/colors';
import {typography} from '../../../shared/theme/typography';
import {radii, spacing} from '../../../shared/theme/spacing';
import AppBadge from '../../../shared/components/AppBadge';
import AppIcon from '../../../shared/components/AppIcon';

interface KpiCardProps {
  data: DashboardKpi;
}

export const KpiCard: React.FC<KpiCardProps> = ({data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <AppIcon name={data.icon} size={16} color={colors.primary} />
        </View>
        <AppBadge
          label={data.badgeText}
          variant={data.badgeVariant}
          size="sm"
        />
      </View>

      <Text style={[typography.caption, styles.title]}>{data.title}</Text>
      <Text style={[typography.h2, styles.value]}>{data.value}</Text>

      <View style={styles.changeRow}>
        <AppIcon
          name={data.trend === 'up' ? 'trending-up' : 'trending-down'}
          size={12}
          color={data.trend === 'up' ? colors.success : colors.danger}
        />
        <Text
          style={[
            typography.caption,
            styles.changeText,
            {color: data.trend === 'up' ? colors.success : colors.danger},
          ]}>
          {data.change} vs yesterday
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 220,
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    margin: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  value: {
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    marginLeft: 4,
    fontSize: 11,
  },
});

export default KpiCard;
