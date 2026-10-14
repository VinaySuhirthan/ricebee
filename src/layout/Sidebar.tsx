import React from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {NavSectionConfig, RouteKey} from '../navigation/navigationTypes';
import {useNavigation} from '../navigation/AppNavigator';
import {typography} from '../shared/theme/typography';
import {spacing, radii} from '../shared/theme/spacing';
import SidebarSection from './SidebarSection';
import AppLogo from '../shared/components/AppLogo';

export const SIDEBAR_SECTIONS: NavSectionConfig[] = [
  {
    key: 'OVERVIEW',
    title: 'OVERVIEW',
    items: [
      {key: 'dashboard', label: 'Dashboard', icon: 'dashboard'},
      {key: 'global-search', label: 'Global Search', icon: 'search'},
    ],
  },
  {
    key: 'SALES & CRM',
    title: 'SALES & CRM',
    items: [
      {
        key: 'offline',
        label: 'Offline Store Billing',
        icon: 'billing',
        badge: 'POS',
      },
      {
        key: 'online',
        label: 'Online Hub & Orders',
        icon: 'online',
        badge: 'Live',
      },
      {key: 'customers', label: 'Customers', icon: 'customers'},
      {key: 'sales-orders', label: 'Sales Orders', icon: 'orders'},
      {key: 'invoices-billing', label: 'Invoices & Billing', icon: 'invoices'},
      {key: 'payments', label: 'Payments', icon: 'payments'},
      {
        key: 'follow-ups',
        label: 'Follow-ups',
        icon: 'followups',
        badge: 5,
      },
      {
        key: 'whatsapp-scheduler',
        label: 'WhatsApp Scheduler',
        icon: 'whatsapp',
        badge: 2,
      },
      {
        key: 'returns',
        label: 'Returns',
        icon: 'returns',
        badge: 3,
      },
    ],
  },
  {
    key: 'WAREHOUSE & SUPPLY CHAIN',
    title: 'WAREHOUSE & SUPPLY CHAIN',
    items: [
      {key: 'goods-inward', label: 'POS — Goods Inward Scale', icon: 'scale'},
      {key: 'products', label: 'Products', icon: 'products'},
    ],
  },
  {
    key: 'SYSTEM',
    title: 'SYSTEM',
    items: [
      {
        key: 'notifications',
        label: 'Notifications',
        icon: 'notifications',
        badge: 9,
      },
      {key: 'activity-log', label: 'Activity Log', icon: 'activity'},
      {key: 'settings', label: 'Settings & Tax', icon: 'settings'},
    ],
  },
];

export const Sidebar: React.FC = () => {
  const {currentRoute, navigate} = useNavigation();

  return (
    <View style={styles.sidebarContainer}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <AppLogo size={28} />
        <View style={styles.brandTextContainer}>
          <Text style={styles.brandName}>RICEBEE</Text>
          <Text style={styles.brandSub}>Enterprise CRM</Text>
        </View>
      </View>

      {/* Nav List */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {SIDEBAR_SECTIONS.map(section => (
          <SidebarSection
            key={section.key}
            section={section}
            currentRoute={currentRoute}
            onSelectRoute={(key: RouteKey) => navigate(key)}
          />
        ))}
      </ScrollView>

      {/* User / Counter Footer */}
      <View style={styles.footerContainer}>
        <Pressable
          style={({pressed}) => [
            styles.userProfile,
            pressed && styles.userProfilePressed,
          ]}
          onPress={() => navigate('activity-log')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>OP</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              Operations Counter
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.userRole}>Terminal Active</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 240, // 240px wide Zoho specification
    backgroundColor: '#FFFFFF', // Pure white, no heavy navy
    borderRightWidth: 1,
    borderRightColor: '#E7E4DD', // Hairline border
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: 56, // matches top bar height
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
    gap: 10,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandName: {
    color: '#1F2421',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  brandSub: {
    color: '#8B938E',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.md,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E7E4DD',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: radii.sm,
  },
  userProfilePressed: {
    backgroundColor: '#F6F5F2',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: '#E8F3EE',
    borderWidth: 1,
    borderColor: '#C5E2D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#1F6B4F',
    fontSize: 11,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#1F2421',
    fontSize: 12,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2E7D4F',
    marginRight: 4,
  },
  userRole: {
    color: '#8B938E',
    fontSize: 10.5,
  },
});

export default Sidebar;
