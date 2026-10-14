import React from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {NavSectionConfig, RouteKey} from '../navigation/navigationTypes';
import {useNavigation} from '../navigation/AppNavigator';
import {colors} from '../shared/theme/colors';
import {typography} from '../shared/theme/typography';
import {spacing, radii} from '../shared/theme/spacing';
import SidebarSection from './SidebarSection';
import AppIcon from '../shared/components/AppIcon';
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
        badgeVariant: 'warning',
      },
      {
        key: 'online',
        label: 'Online Hub & Orders',
        icon: 'online',
        badge: 'Live',
        badgeVariant: 'info',
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
        badgeVariant: 'warning',
      },
      {
        key: 'whatsapp-scheduler',
        label: 'WhatsApp Scheduler',
        icon: 'whatsapp',
        badge: 2,
        badgeVariant: 'info',
      },
      {
        key: 'returns',
        label: 'Returns',
        icon: 'returns',
        badge: 3,
        badgeVariant: 'danger',
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
        badgeVariant: 'danger',
      },
      {key: 'activity-log', label: 'Activity Log', icon: 'activity'},
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({onClose}) => {
  const {currentRoute, navigate} = useNavigation();

  return (
    <View style={styles.sidebarContainer}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <AppLogo size={36} />
        <View style={styles.brandTextContainer}>
          <Text style={[typography.h3, styles.brandName]}>RICEBEE</Text>
          <Text style={[typography.caption, styles.brandSub]}>
            Enterprise CRM v1.0
          </Text>
        </View>
        {onClose && (
          <Pressable
            style={({pressed}) => [
              styles.collapseBtn,
              pressed && styles.collapseBtnPressed,
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close sidebar">
            <Text style={styles.collapseIcon}>☰</Text>
          </Pressable>
        )}
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

      {/* User / Workplace Footer */}
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
              Operations Lead
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.userRole}>Windows Desktop</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 260,
    backgroundColor: colors.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: colors.sidebarBorder,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.sidebarBorder,
    gap: spacing.md,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  brandSub: {
    color: colors.sidebarSection,
    fontSize: 11,
  },
  collapseBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapseBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  collapseIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E2E8F0',
    lineHeight: 20,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.md,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.sidebarBorder,
    padding: spacing.md,
    backgroundColor: '#070E1C',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: radii.sm,
  },
  userProfilePressed: {
    backgroundColor: colors.sidebarHover,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  userRole: {
    color: colors.textMuted,
    fontSize: 10,
  },
});

export default Sidebar;
