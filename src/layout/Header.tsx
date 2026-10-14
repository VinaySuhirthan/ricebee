import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '../navigation/AppNavigator';
import {colors} from '../shared/theme/colors';
import {typography} from '../shared/theme/typography';
import {spacing, radii} from '../shared/theme/spacing';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const {currentRoute} = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {onToggleSidebar && (
          <Pressable
            style={({pressed}) => [
              styles.hamburgerBtn,
              pressed && styles.hamburgerBtnPressed,
            ]}
            onPress={onToggleSidebar}
            accessibilityRole="button"
            accessibilityLabel={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            <Text style={styles.hamburgerIcon}>☰</Text>
          </Pressable>
        )}
        <View style={styles.titleWrapper}>
          <Text style={[typography.h3, styles.titleText]}>
            {formatRouteTitle(currentRoute)}
          </Text>
        </View>
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
    case 'offline':
      return 'Offline Store Billing';
    case 'online':
      return 'Online Hub & Digital Orders';
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
  hamburgerBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hamburgerBtnPressed: {
    backgroundColor: '#E2E8F0',
  },
  hamburgerIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
  },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.xs,
    backgroundColor: colors.tableRowAlt,
    borderWidth: 1,
    borderColor: colors.cardBorder,
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
    backgroundColor: colors.appBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
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
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnPressed: {
    opacity: 0.75,
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
