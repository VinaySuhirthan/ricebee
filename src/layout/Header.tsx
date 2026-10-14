import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '../navigation/AppNavigator';
import {typography} from '../shared/theme/typography';
import {spacing, radii} from '../shared/theme/spacing';
import AppIcon from '../shared/components/AppIcon';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const {currentRoute, navigate} = useNavigation();

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
            accessibilityLabel={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <AppIcon name="dashboard" size={15} color="#5E6661" />
          </Pressable>
        )}
        <View style={styles.titleWrapper}>
          <Text style={[typography.h2, styles.titleText]}>
            {formatRouteTitle(currentRoute)}
          </Text>
        </View>
      </View>

      {/* Center Search Pill */}
      <View style={styles.centerSection}>
        <Pressable
          style={styles.quickSearchPill}
          onPress={() => navigate('global-search')}>
          <AppIcon name="search" size={13} color="#8B938E" style={styles.searchIcon} />
          <Text style={styles.quickSearchText}>Search customers, orders, inventory (Ctrl+K)...</Text>
        </Pressable>
      </View>

      {/* Right User & System Controls */}
      <View style={styles.rightSection}>
        <Pressable
          style={({pressed}) => [
            styles.headerActionBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={() => navigate('settings')}>
          <AppIcon name="settings" size={15} color="#5E6661" />
        </Pressable>

        <Pressable
          style={({pressed}) => [
            styles.headerActionBtn,
            pressed && styles.btnPressed,
          ]}
          onPress={() => navigate('notifications')}>
          <AppIcon name="notifications" size={15} color="#5E6661" />
          <View style={styles.notificationDot} />
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
      return 'Global Search';
    case 'customers':
      return 'Customers & Accounts';
    case 'sales-orders':
      return 'Sales Orders & Fulfillment';
    case 'offline':
      return 'Offline Store Billing';
    case 'online':
      return 'Online Hub & Orders';
    case 'invoices-billing':
      return 'Invoices & Billing';
    case 'payments':
      return 'Payments & Settlements';
    case 'follow-ups':
      return 'Customer Follow-ups';
    case 'whatsapp-scheduler':
      return 'WhatsApp Scheduler';
    case 'returns':
      return 'Returns & Credit Notes';
    case 'goods-inward':
      return 'Goods Inward Scale';
    case 'products':
      return 'Products & Inventory';
    case 'notifications':
      return 'Notifications';
    case 'activity-log':
      return 'Activity Log';
    case 'settings':
      return 'Settings & Tax Configuration';
    default:
      return 'Enterprise CRM';
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 56, // 56px top bar specification
    backgroundColor: '#FFFFFF', // Clean white
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD', // Hairline divider
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
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: '#F6F5F2',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hamburgerBtnPressed: {
    backgroundColor: '#EAE7E0',
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  titleText: {
    color: '#1F2421',
    fontSize: 16,
    fontWeight: '600',
  },
  centerSection: {
    flex: 1,
    maxWidth: 380,
    marginHorizontal: spacing.lg,
  },
  quickSearchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F5F2',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    height: 34,
  },
  searchIcon: {
    marginRight: 8,
  },
  quickSearchText: {
    color: '#8B938E',
    fontSize: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnPressed: {
    backgroundColor: '#F6F5F2',
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C0392B',
  },
});

export default Header;
