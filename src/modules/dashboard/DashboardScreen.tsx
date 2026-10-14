import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {DashboardKpi, RecentOrderSummary, ActivitySummaryItem} from './types';
import KpiCard from './components/KpiCard';
import PageHeader from '../../shared/components/PageHeader';
import AppCard from '../../shared/components/AppCard';
import AppTable from '../../shared/components/AppTable';
import AppBadge from '../../shared/components/AppBadge';
import AppButton from '../../shared/components/AppButton';
import {TableColumn} from '../../shared/types/common';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing} from '../../shared/theme/spacing';
import {useNavigation} from '../../navigation/AppNavigator';

const SAMPLE_KPIS: DashboardKpi[] = [
  {
    id: 'kpi-1',
    title: "Today's Gross Sales",
    value: '₹3,42,850',
    change: '+14.2%',
    trend: 'up',
    icon: 'billing',
    badgeText: 'Active',
    badgeVariant: 'success',
  },
  {
    id: 'kpi-2',
    title: 'Pending Sales Orders',
    value: '24 Orders',
    change: '-3.1%',
    trend: 'down',
    icon: 'orders',
    badgeText: 'Fulfillment',
    badgeVariant: 'warning',
  },
  {
    id: 'kpi-3',
    title: 'Goods Inward (Today)',
    value: '18.4 Tons',
    change: '+8.6%',
    trend: 'up',
    icon: 'scale',
    badgeText: 'Weighbridge',
    badgeVariant: 'info',
  },
  {
    id: 'kpi-4',
    title: 'Customer Follow-ups',
    value: '12 Due',
    change: '5 High Priority',
    trend: 'neutral',
    icon: 'followups',
    badgeText: 'Action Req.',
    badgeVariant: 'danger',
  },
];

const SAMPLE_RECENT_ORDERS: RecentOrderSummary[] = [
  {
    id: 'ord-101',
    orderNumber: 'SO-2026-0891',
    customerName: 'Shri Ram Agro Traders',
    date: 'Today, 01:45 PM',
    amount: '₹84,500',
    status: 'completed',
    itemsCount: 45,
  },
  {
    id: 'ord-102',
    orderNumber: 'SO-2026-0890',
    customerName: 'Kaveri Grain Suppliers',
    date: 'Today, 12:10 PM',
    amount: '₹1,24,000',
    status: 'processing',
    itemsCount: 80,
  },
  {
    id: 'ord-103',
    orderNumber: 'SO-2026-0889',
    customerName: 'Balaji Wholesale Mart',
    date: 'Today, 10:30 AM',
    amount: '₹42,200',
    status: 'pending',
    itemsCount: 25,
  },
  {
    id: 'ord-104',
    orderNumber: 'SO-2026-0888',
    customerName: 'Lakshmi Retail Stores',
    date: 'Yesterday',
    amount: '₹91,750',
    status: 'completed',
    itemsCount: 50,
  },
];

const SAMPLE_ACTIVITIES: ActivitySummaryItem[] = [
  {
    id: 'act-1',
    action: 'Truck MH-12-AQ-9812 gross weighed 24,180 kg',
    user: 'Weighbridge Op 1',
    timestamp: '15 mins ago',
    type: 'inward',
  },
  {
    id: 'act-2',
    action: 'Counter invoice INV-2026-1102 generated for ₹34,200',
    user: 'Cashier 2',
    timestamp: '32 mins ago',
    type: 'sale',
  },
  {
    id: 'act-3',
    action: 'NEFT payment received ₹1,20,000 from Sri Balaji Rice',
    user: 'Accounts Desk',
    timestamp: '1 hour ago',
    type: 'payment',
  },
  {
    id: 'act-4',
    action: 'WhatsApp payment reminder triggered for 18 debtors',
    user: 'CRM Bot',
    timestamp: '2 hours ago',
    type: 'alert',
  },
];

export const DashboardScreen: React.FC = () => {
  const {navigate} = useNavigation();

  const columns: TableColumn<RecentOrderSummary>[] = [
    {
      key: 'orderNumber',
      title: 'ORDER #',
      width: 140,
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.primary}]}>
          {item.orderNumber}
        </Text>
      ),
    },
    {
      key: 'customerName',
      title: 'CUSTOMER',
      width: 220,
      render: item => (
        <Text style={[typography.bodyMedium, {color: colors.textPrimary}]}>
          {item.customerName}
        </Text>
      ),
    },
    {
      key: 'itemsCount',
      title: 'QTY (BAGS)',
      width: 110,
      align: 'center',
    },
    {
      key: 'amount',
      title: 'AMOUNT',
      width: 130,
      align: 'right',
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
          {item.amount}
        </Text>
      ),
    },
    {
      key: 'status',
      title: 'STATUS',
      width: 130,
      align: 'center',
      render: item => {
        const variant =
          item.status === 'completed'
            ? 'success'
            : item.status === 'processing'
            ? 'primary'
            : 'warning';
        return (
          <AppBadge
            label={item.status.toUpperCase()}
            variant={variant}
            size="sm"
          />
        );
      },
    },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader
        title="Operations Dashboard"
        description="Real-time overview of sales counter, mill orders, inward scale, and receivables."
        breadcrumb={['RICEBEE', 'Overview', 'Dashboard']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Manual Billing"
              variant="secondary"
              size="sm"
              icon="billing"
              onPress={() => navigate('manual-billing')}
            />
            <AppButton
              title="Scale Inward"
              variant="primary"
              size="sm"
              icon="scale"
              onPress={() => navigate('goods-inward')}
            />
          </View>
        }
      />

      {/* KPI Cards Row */}
      <View style={styles.kpiGrid}>
        {SAMPLE_KPIS.map(kpi => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </View>

      {/* Main Grid: Orders & Activity Feed */}
      <View style={styles.contentGrid}>
        <View style={styles.leftCol}>
          <AppCard
            title="Recent Sales Orders"
            subtitle="Latest orders from counter and wholesale channels"
            action={
              <AppButton
                title="View All"
                variant="ghost"
                size="sm"
                onPress={() => navigate('sales-orders')}
              />
            }>
            <AppTable
              columns={columns}
              data={SAMPLE_RECENT_ORDERS}
              keyExtractor={item => item.id}
              onRowPress={() => navigate('sales-orders')}
            />
          </AppCard>
        </View>

        <View style={styles.rightCol}>
          <AppCard
            title="Live Operational Feed"
            subtitle="Automated mill & weighbridge events"
            action={
              <AppButton
                title="Logs"
                variant="ghost"
                size="sm"
                onPress={() => navigate('activity-log')}
              />
            }>
            <View style={styles.activityList}>
              {SAMPLE_ACTIVITIES.map(act => (
                <View key={act.id} style={styles.activityItem}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityDetails}>
                    <Text style={[typography.body, styles.activityAction]}>
                      {act.action}
                    </Text>
                    <View style={styles.activityMeta}>
                      <Text style={[typography.caption, styles.activityUser]}>
                        {act.user}
                      </Text>
                      <Text style={styles.metaDivider}>•</Text>
                      <Text style={[typography.caption, styles.activityTime]}>
                        {act.timestamp}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </AppCard>
        </View>
      </View>
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  contentGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  leftCol: {
    flex: 2,
  },
  rightCol: {
    flex: 1,
  },
  activityList: {
    paddingVertical: spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 47, 77, 0.4)',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.md,
  },
  activityDetails: {
    flex: 1,
  },
  activityAction: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  activityUser: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  metaDivider: {
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  activityTime: {
    color: colors.textMuted,
    fontSize: 11,
  },
});

export default DashboardScreen;
