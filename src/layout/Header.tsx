import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '../navigation/AppNavigator';
import {colors} from '../shared/theme/colors';
import {typography} from '../shared/theme/typography';
import {spacing, radii} from '../shared/theme/spacing';
import AppIcon from '../shared/components/AppIcon';

export const Header: React.FC = () => {
  const {currentRoute, navigate, canGoBack, goBack} = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {canGoBack && (
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            style={({pressed}) => [
              styles.backBtn,
              pressed && styles.btnPressed,
            ]}>
            <AppIcon name="arrow-left" size={14} color={colors.textSecondary} />
          </Pressable>
        )}
        <View style={styles.titleWrapper}>
          <Text style={[typography.h3, styles.titleText]}>
            {formatRouteTitle(currentRoute)}
          </Text>
        </View>
      </View>

      {/* Global Quick Search Pill */}
      <Pressable
        onPress={() => navigate('global-search')}
        style={({pressed}) => [
          styles.quickSearchPill,
          pressed && styles.quickSearchPressed,
        ]}>
        <AppIcon
          name="search"
          size={13}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <Text style={[typography.caption, styles.quickSearchText]}>
          Search orders, customers, products (Ctrl+K)...
        </Text>
      </Pressable>

      {/* Right Header Actions */}
      <View style={styles.rightSection}>
        <Pressable
          onPress={() => navigate('manual-billing')}
          style={({pressed}) => [
            styles.quickActionBtn,
            pressed && styles.btnPressed,
          ]}>
          <AppIcon name="plus" size={13} color={colors.white} />
          <Text style={styles.quickActionText}>New Bill</Text>
        </Pressable>

        <Pressable
          onPress={() => navigate('notifications')}
          accessibilityRole="button"
          style={({pressed}) => [styles.iconBtn, pressed && styles.btnPressed]}>
          <AppIcon
            name="notifications"
            size={15}
            color={colors.textSecondary}
          />
          <View style={styles.notificationDot} />
        </Pressable>

        <Pressable
          onPress={() => navigate('activity-log')}
          accessibilityRole="button"
          style={({pressed}) => [styles.iconBtn, pressed && styles.btnPressed]}>
          <AppIcon name="activity" size={15} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
};

function formatRouteTitle(route: string): string {
  switch (route) {
    case 'dashboard':
      return 'Overview Dashboard';
    case 'global-search':
      return 'Global System Search';
    case 'customers':
      return 'Customers & Accounts';
    case 'sales-orders':
      return 'Sales Orders & Fulfillment';
    case 'manual-billing':
      return 'Manual Billing & Counter POS';
    case 'invoices-billing':
      return 'Invoices & Tax Billing';
    case 'payments':
      return 'Payments & Settlements';
    case 'follow-ups':
      return 'Customer Follow-ups';
    case 'whatsapp-scheduler':
      return 'WhatsApp Campaign Scheduler';
    case 'returns':
      return 'Returns & Credit Notes';
    case 'goods-inward':
      return 'POS — Goods Inward Scale';
    case 'products':
      return 'Product Catalog & Inventory';
    case 'notifications':
      return 'System Notifications';
    case 'activity-log':
      return 'Audit Trail & Activity Log';
    default:
      return 'CRM Workspace';
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 52,
    backgroundColor: colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.xs,
    backgroundColor: '#162238',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  quickSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1020',
    borderWidth: 1,
    borderColor: '#1F2E4A',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    width: 320,
  },
  quickSearchPressed: {
    borderColor: colors.primary,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  quickSearchText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.sm,
  },
  quickActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: '#131D33',
    borderWidth: 1,
    borderColor: '#202E4C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnPressed: {
    opacity: 0.8,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
});

export default Header;
