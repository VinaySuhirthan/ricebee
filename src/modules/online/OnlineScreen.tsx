import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {colors} from '../../shared/theme/colors';
import {spacing, radii} from '../../shared/theme/spacing';
import {PageHeader} from '../../shared/components/PageHeader';
import {AppCard} from '../../shared/components/AppCard';
import {AppBadge} from '../../shared/components/AppBadge';
import {AppButton} from '../../shared/components/AppButton';
import {AppIcon} from '../../shared/components/AppIcon';
import {OnlineOrder, OnlineOrderStatus} from './types';

const INITIAL_ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'ord-on-101',
    orderNumber: 'ORD-ON-8801',
    source: 'WhatsApp',
    customerName: 'Sri Sai Supermart (Guntur)',
    phone: '9849201948',
    location: 'Guntur, AP',
    itemsSummary: 'Sona Masoori Raw 25kg x 80 Bags',
    totalBags: 80,
    totalAmount: 96000,
    paymentStatus: 'Paid (UPI)',
    status: 'new_order',
    timestamp: '10 mins ago',
  },
  {
    id: 'ord-on-102',
    orderNumber: 'ORD-ON-8802',
    source: 'Web Portal',
    customerName: 'Hyderabad Kirana Wholesale Hub',
    phone: '9121890342',
    location: 'Begum Bazar, HYD',
    itemsSummary: 'BPT 5204 Steam 50kg x 120 Bags',
    totalBags: 120,
    totalAmount: 252000,
    paymentStatus: 'Advance Received',
    status: 'confirmed',
    timestamp: '42 mins ago',
  },
  {
    id: 'ord-on-103',
    orderNumber: 'ORD-ON-8803',
    source: 'B2B App',
    customerName: 'Vijaya Lakshmi Food Distributors',
    phone: '9701837492',
    location: 'Vijayawada, AP',
    itemsSummary: 'Basmati 1121 25kg x 40 Bags',
    totalBags: 40,
    totalAmount: 76000,
    paymentStatus: 'Paid (UPI)',
    status: 'dispatched',
    timestamp: '2 hours ago',
  },
  {
    id: 'ord-on-104',
    orderNumber: 'ORD-ON-8804',
    source: 'WhatsApp',
    customerName: 'Tirupati Daily Mart Chain',
    phone: '9440182746',
    location: 'Tirupati, AP',
    itemsSummary: 'HMT Rice 50kg x 60 Bags',
    totalBags: 60,
    totalAmount: 114000,
    paymentStatus: 'Pending',
    status: 'processing',
    timestamp: '3 hours ago',
  },
];

export const OnlineScreen: React.FC = () => {
  const [orders, setOrders] = useState<OnlineOrder[]>(INITIAL_ONLINE_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'confirmed' | 'dispatched'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const newOrders = orders.filter(o => o.status === 'new_order').length;
    const whatsAppCount = orders.filter(o => o.source === 'WhatsApp').length;

    return {totalOrders, totalRevenue, newOrders, whatsAppCount};
  }, [orders]);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert('Sync Successful', 'Cloud inventory and online orders are fully updated.');
    }, 1200);
  };

  const handleUpdateStatus = (id: string, newStatus: OnlineOrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? {...o, status: newStatus} : o)),
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'new'
          ? o.status === 'new_order'
          : activeFilter === 'confirmed'
          ? o.status === 'confirmed'
          : o.status === 'dispatched';

      return matchSearch && matchFilter;
    });
  }, [orders, searchQuery, activeFilter]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <PageHeader
        title="Online Hub & Digital Orders"
        description="Manage cloud-synced web, WhatsApp orders, live digital catalog, and remote inventory"
        actions={
          <View style={styles.headerActions}>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>CLOUD CONNECTED (LIVE)</Text>
            </View>
            <AppButton
              title={isSyncing ? 'Syncing...' : 'Sync Cloud Now'}
              variant="primary"
              size="sm"
              icon="refresh"
              onPress={handleTriggerSync}
            />
          </View>
        }
      />

      {/* KPI Stats */}
      <View style={styles.kpiRow}>
        <AppCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>ONLINE ORDERS TODAY</Text>
          <Text style={styles.kpiValue}>{stats.totalOrders}</Text>
          <Text style={styles.kpiSub}>{stats.newOrders} awaiting confirmation</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>ONLINE REVENUE</Text>
          <Text style={[styles.kpiValue, {color: colors.primary}]}>
            ₹{stats.totalRevenue.toLocaleString()}
          </Text>
          <Text style={styles.kpiSub}>Digital & B2B Orders</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>WHATSAPP INQUIRIES</Text>
          <Text style={styles.kpiValue}>{stats.whatsAppCount}</Text>
          <Text style={styles.kpiSub}>Received via connected bot</Text>
        </AppCard>

        <AppCard style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>SYNC ENGINE STATUS</Text>
          <View style={styles.syncRow}>
            <Text style={[styles.kpiValue, {color: colors.success}]}>Active</Text>
            <AppBadge label="Zero Latency" variant="success" size="sm" />
          </View>
          <Text style={styles.kpiSub}>Last heartbeat 1m ago</Text>
        </AppCard>
      </View>

      {/* Main Orders Table Card */}
      <View style={styles.tableSection}>
        <View style={styles.tableHeaderBar}>
          <View>
            <Text style={styles.tableTitle}>Online & WhatsApp Orders</Text>
            <Text style={styles.tableSubtitle}>
              Live feed from online portal and WhatsApp catalog
            </Text>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPills}>
            <Pressable
              style={[
                styles.filterPill,
                activeFilter === 'all' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('all')}>
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'all' && styles.filterPillTextActive,
                ]}>
                All ({orders.length})
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterPill,
                activeFilter === 'new' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('new')}>
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'new' && styles.filterPillTextActive,
                ]}>
                New ({stats.newOrders})
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterPill,
                activeFilter === 'confirmed' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('confirmed')}>
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'confirmed' && styles.filterPillTextActive,
                ]}>
                Confirmed
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterPill,
                activeFilter === 'dispatched' && styles.filterPillActive,
              ]}
              onPress={() => setActiveFilter('dispatched')}>
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === 'dispatched' && styles.filterPillTextActive,
                ]}>
                Dispatched
              </Text>
            </Pressable>
          </View>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <AppIcon name="search" size={14} color={colors.textMuted} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search online order, buyer..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <AppCard style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colHeader, {width: 120}]}>ORDER #</Text>
            <Text style={[styles.colHeader, {width: 110}]}>CHANNEL</Text>
            <Text style={[styles.colHeader, {flex: 2}]}>BUYER & LOCATION</Text>
            <Text style={[styles.colHeader, {flex: 2}]}>ITEMS ORDERED</Text>
            <Text style={[styles.colHeader, {width: 110, textAlign: 'right'}]}>AMOUNT (₹)</Text>
            <Text style={[styles.colHeader, {width: 110, textAlign: 'center'}]}>PAYMENT</Text>
            <Text style={[styles.colHeader, {width: 110, textAlign: 'center'}]}>STATUS</Text>
            <Text style={[styles.colHeader, {width: 130, textAlign: 'center'}]}>ACTION</Text>
          </View>

          {filteredOrders.map((ord, idx) => (
            <View
              key={ord.id}
              style={[
                styles.tableRow,
                idx % 2 === 1 && styles.tableRowAlt,
              ]}>
              <View style={{width: 120}}>
                <Text style={styles.orderNumberText}>{ord.orderNumber}</Text>
                <Text style={styles.timestampText}>{ord.timestamp}</Text>
              </View>

              <View style={{width: 110}}>
                <AppBadge
                  label={ord.source}
                  variant={
                    ord.source === 'WhatsApp'
                      ? 'success'
                      : ord.source === 'Web Portal'
                      ? 'info'
                      : 'primary'
                  }
                  size="sm"
                />
              </View>

              <View style={{flex: 2}}>
                <Text style={styles.buyerNameText} numberOfLines={1}>
                  {ord.customerName}
                </Text>
                <Text style={styles.locationText}>{ord.location} • {ord.phone}</Text>
              </View>

              <View style={{flex: 2}}>
                <Text style={styles.itemsText} numberOfLines={1}>
                  {ord.itemsSummary}
                </Text>
                <Text style={styles.timestampText}>{ord.totalBags} total bags</Text>
              </View>

              <View style={{width: 110, alignItems: 'flex-end'}}>
                <Text style={styles.amountText}>
                  ₹{ord.totalAmount.toLocaleString()}
                </Text>
              </View>

              <View style={{width: 110, alignItems: 'center'}}>
                <AppBadge
                  label={ord.paymentStatus}
                  variant={
                    ord.paymentStatus === 'Paid (UPI)'
                      ? 'success'
                      : ord.paymentStatus === 'Advance Received'
                      ? 'info'
                      : 'warning'
                  }
                  size="sm"
                />
              </View>

              <View style={{width: 110, alignItems: 'center'}}>
                <AppBadge
                  label={ord.status.toUpperCase().replace('_', ' ')}
                  variant={
                    ord.status === 'new_order'
                      ? 'warning'
                      : ord.status === 'confirmed'
                      ? 'primary'
                      : ord.status === 'dispatched'
                      ? 'info'
                      : 'neutral'
                  }
                  size="sm"
                />
              </View>

              <View style={{width: 130, alignItems: 'center'}}>
                {ord.status === 'new_order' ? (
                  <AppButton
                    title="Confirm Order"
                    variant="primary"
                    size="sm"
                    onPress={() => handleUpdateStatus(ord.id, 'confirmed')}
                  />
                ) : ord.status === 'confirmed' ? (
                  <AppButton
                    title="Dispatch"
                    variant="outline"
                    size="sm"
                    onPress={() => handleUpdateStatus(ord.id, 'dispatched')}
                  />
                ) : (
                  <Text style={styles.completedText}>Ready</Text>
                )}
              </View>
            </View>
          ))}
        </AppCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#C5E2D6',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
    letterSpacing: 0.5,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  kpiCard: {
    flex: 1,
    padding: spacing.md,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tableSection: {
    gap: spacing.sm,
  },
  tableHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tableSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    padding: 3,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 4,
  },
  filterPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: colors.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    height: 34,
    width: 240,
    gap: 6,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    padding: 0,
  },
  tableCard: {
    padding: 0,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tableRowAlt,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tableRowAlt: {
    backgroundColor: colors.tableRowAlt,
  },
  orderNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  timestampText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  buyerNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  itemsText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  completedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
});

export default OnlineScreen;
