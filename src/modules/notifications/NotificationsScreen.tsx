import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {NotificationItem} from './types';
import PageHeader from '../../shared/components/PageHeader';
import AppCard from '../../shared/components/AppCard';
import AppBadge from '../../shared/components/AppBadge';
import AppButton from '../../shared/components/AppButton';
import AppIcon from '../../shared/components/AppIcon';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing, radii} from '../../shared/theme/spacing';
import {useNavigation} from '../../navigation/AppNavigator';
import {RouteKey} from '../../navigation/navigationTypes';

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High Moisture Content Alert at Weighbridge',
    message:
      'Vehicle MH-31-CB-5541 tested at 14.8% moisture on Paddy HMT lot. Requires manager manual override before tare weighment.',
    timestamp: '12 mins ago',
    type: 'weighbridge',
    isRead: false,
    actionRoute: 'goods-inward',
    badgeText: 'Weighbridge',
    badgeVariant: 'danger',
    icon: 'scale',
    createdAt: '2026-10-14T08:48:00',
  },
  {
    id: 'notif-2',
    title: 'Credit Limit Exceeded for Shri Ram Agro Traders',
    message:
      'Customer outstanding balance reached ₹1,42,800 out of ₹5,00,000 sanctioned limit. New orders require partial advance receipt.',
    timestamp: '35 mins ago',
    type: 'payment',
    isRead: false,
    actionRoute: 'customers',
    badgeText: 'Credit Hold',
    badgeVariant: 'warning',
    icon: 'customers',
    createdAt: '2026-10-14T08:25:00',
  },
  {
    id: 'notif-3',
    title: 'E-Way Bill Successfully Generated',
    message:
      'NIC E-Way Bill #EB-271982141 synced with GST portal for dispatch invoice INV-2026-1102.',
    timestamp: '1 hour ago',
    type: 'order',
    isRead: false,
    actionRoute: 'invoices-billing',
    badgeText: 'E-Way Bill',
    badgeVariant: 'success',
    icon: 'invoices',
    createdAt: '2026-10-14T07:50:00',
  },
  {
    id: 'notif-4',
    title: 'Stock Alert: HMT Kolam Below Minimum Buffer',
    message:
      'Godown A - Bay 3 has 85 bags remaining. Automated reorder threshold is 150 bags.',
    timestamp: '2 hours ago',
    type: 'alert',
    isRead: true,
    actionRoute: 'products',
    badgeText: 'Inventory',
    badgeVariant: 'danger',
    icon: 'products',
    createdAt: '2026-10-14T06:30:00',
  },
  {
    id: 'notif-5',
    title: 'Daily WhatsApp Rate Card Broadcast Completed',
    message:
      '420 registered brokers and wholesale traders received the morning price bulletin.',
    timestamp: '4 hours ago',
    type: 'system',
    isRead: true,
    actionRoute: 'whatsapp-scheduler',
    badgeText: 'Broadcast',
    badgeVariant: 'info',
    icon: 'whatsapp',
    createdAt: '2026-10-14T04:15:00',
  },
];

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const {navigate} = useNavigation();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  const filtered = notifications.filter(n =>
    filter === 'unread' ? !n.isRead : true,
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader
        title="System Notifications"
        description="Operational alerts from weighbridge sensors, credit limit breaches, GST E-Way sync, and automated workflows."
        breadcrumb={['RICEBEE', 'System', 'Notifications']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Mark All as Read"
              variant="secondary"
              size="sm"
              icon="check"
              onPress={markAllRead}
            />
          </View>
        }
      />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setFilter('all')}
          style={[styles.tab, filter === 'all' && styles.tabActive]}>
          <Text
            style={[
              typography.captionMedium,
              filter === 'all' ? styles.tabTextActive : styles.tabTextInactive,
            ]}>
            ALL NOTIFICATIONS ({notifications.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('unread')}
          style={[styles.tab, filter === 'unread' && styles.tabActive]}>
          <Text
            style={[
              typography.captionMedium,
              filter === 'unread'
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}>
            UNREAD ({notifications.filter(n => !n.isRead).length})
          </Text>
        </Pressable>
      </View>

      <AppCard title="Alert Feed" subtitle="Real-time event stream">
        <View style={styles.listContainer}>
          {filtered.map(item => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (item.actionRoute) {
                  navigate(item.actionRoute as RouteKey);
                }
              }}
              style={({pressed}) => [
                styles.itemCard,
                !item.isRead && styles.itemCardUnread,
                pressed && styles.itemCardPressed,
              ]}>
              <View style={styles.itemLeft}>
                <View style={styles.iconCircle}>
                  <AppIcon name={item.icon} size={15} color={colors.primary} />
                </View>
                <View style={styles.itemTextContainer}>
                  <View style={styles.titleRow}>
                    {!item.isRead && <View style={styles.unreadDot} />}
                    <Text
                      style={[
                        typography.bodyBold,
                        styles.itemTitle,
                        !item.isRead && styles.unreadTitle,
                      ]}>
                      {item.title}
                    </Text>
                    <AppBadge
                      label={item.badgeText}
                      variant={item.badgeVariant}
                      size="sm"
                    />
                  </View>
                  <Text style={[typography.body, styles.itemMessage]}>
                    {item.message}
                  </Text>
                  <Text style={[typography.caption, styles.itemTimestamp]}>
                    {item.timestamp}
                  </Text>
                </View>
              </View>

              <AppIcon name="arrow-right" size={13} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </AppCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  content: {
    padding: spacing.xl,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: colors.primary,
  },
  tabTextActive: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  tabTextInactive: {
    color: colors.textSecondary,
  },
  listContainer: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.sm,
    padding: spacing.lg,
  },
  itemCardUnread: {
    backgroundColor: '#12203A',
    borderColor: '#243C6B',
  },
  itemCardPressed: {
    backgroundColor: colors.sidebarHover,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  itemTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    marginRight: 4,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  unreadTitle: {
    color: colors.white,
    fontWeight: '700',
  },
  itemMessage: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemTimestamp: {
    color: colors.textMuted,
    fontSize: 11,
  },
});

export default NotificationsScreen;
