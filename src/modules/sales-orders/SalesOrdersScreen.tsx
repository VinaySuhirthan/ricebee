import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {SalesOrderRecord} from './types';
import PageHeader from '../../shared/components/PageHeader';
import AppCard from '../../shared/components/AppCard';
import AppTable from '../../shared/components/AppTable';
import AppBadge from '../../shared/components/AppBadge';
import AppButton from '../../shared/components/AppButton';
import AppInput from '../../shared/components/AppInput';
import {TableColumn} from '../../shared/types/common';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing, radii} from '../../shared/theme/spacing';
import {useNavigation} from '../../navigation/AppNavigator';

const SAMPLE_ORDERS: SalesOrderRecord[] = [
  {
    id: 'so-1',
    orderNumber: 'SO-2026-0891',
    customerName: 'Rajesh Agrawal',
    customerFirm: 'Shri Ram Agro Traders',
    orderDate: '14-Oct-2026',
    deliveryDate: '16-Oct-2026',
    totalBags: 45,
    totalWeightTons: 2.25,
    grandTotal: '₹84,500',
    advancePaid: '₹30,000',
    balanceDue: '₹54,500',
    status: 'pending',
    items: [
      {
        id: 'item-1',
        productName: 'Sonam Steamed Rice (50kg)',
        variety: 'Sonam Steamed',
        quantityBags: 45,
        weightKg: 2250,
        ratePerBag: 1877,
        totalAmount: 84500,
      },
    ],
    createdAt: '2026-10-14T08:15:00',
  },
  {
    id: 'so-2',
    orderNumber: 'SO-2026-0890',
    customerName: 'Suresh Patil',
    customerFirm: 'Kaveri Grain Suppliers',
    orderDate: '14-Oct-2026',
    deliveryDate: '15-Oct-2026',
    totalBags: 80,
    totalWeightTons: 4.0,
    grandTotal: '₹1,24,000',
    advancePaid: '₹1,24,000',
    balanceDue: '₹0',
    status: 'processing',
    items: [
      {
        id: 'item-2',
        productName: 'HMT Kolam Premium (50kg)',
        variety: 'Kolam',
        quantityBags: 80,
        weightKg: 4000,
        ratePerBag: 1550,
        totalAmount: 124000,
      },
    ],
    createdAt: '2026-10-14T06:40:00',
  },
  {
    id: 'so-3',
    orderNumber: 'SO-2026-0889',
    customerName: 'Venkatesh Rao',
    customerFirm: 'Balaji Wholesale Mart',
    orderDate: '13-Oct-2026',
    deliveryDate: '14-Oct-2026',
    totalBags: 250,
    totalWeightTons: 12.5,
    grandTotal: '₹5,42,200',
    advancePaid: '₹2,00,000',
    balanceDue: '₹3,42,200',
    status: 'dispatched',
    items: [
      {
        id: 'item-3',
        productName: '1121 Raw Basmati Super (50kg)',
        variety: 'Basmati',
        quantityBags: 250,
        weightKg: 12500,
        ratePerBag: 2168,
        totalAmount: 542200,
      },
    ],
    createdAt: '2026-10-13T11:20:00',
  },
  {
    id: 'so-4',
    orderNumber: 'SO-2026-0888',
    customerName: 'Pooja Deshmukh',
    customerFirm: 'Lakshmi Retail Stores',
    orderDate: '12-Oct-2026',
    deliveryDate: '13-Oct-2026',
    totalBags: 50,
    totalWeightTons: 2.5,
    grandTotal: '₹91,750',
    advancePaid: '₹91,750',
    balanceDue: '₹0',
    status: 'delivered',
    items: [
      {
        id: 'item-4',
        productName: 'Wada Kolam Classic (50kg)',
        variety: 'Kolam',
        quantityBags: 50,
        weightKg: 2500,
        ratePerBag: 1835,
        totalAmount: 91750,
      },
    ],
    createdAt: '2026-10-12T09:10:00',
  },
];

export const SalesOrdersScreen: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderRecord | null>(
    SAMPLE_ORDERS[0],
  );
  const {navigate} = useNavigation();

  const filteredOrders = useMemo(() => {
    return SAMPLE_ORDERS.filter(o => {
      const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerFirm.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, search]);

  const columns: TableColumn<SalesOrderRecord>[] = [
    {
      key: 'orderNumber',
      title: 'ORDER #',
      width: 140,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.primary}]}>
            {item.orderNumber}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.orderDate}
          </Text>
        </View>
      ),
    },
    {
      key: 'customerFirm',
      title: 'CUSTOMER FIRM',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.customerFirm}
          </Text>
          <Text style={[typography.caption, {color: colors.textSecondary}]}>
            {item.customerName}
          </Text>
        </View>
      ),
    },
    {
      key: 'totalBags',
      title: 'BAGS / TONS',
      width: 130,
      align: 'center',
      render: item => (
        <Text style={[typography.bodyMedium, {color: colors.textPrimary}]}>
          {item.totalBags} bags ({item.totalWeightTons} T)
        </Text>
      ),
    },
    {
      key: 'grandTotal',
      title: 'TOTAL & BALANCE',
      width: 150,
      align: 'right',
      render: item => (
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.grandTotal}
          </Text>
          <Text
            style={[
              typography.caption,
              {
                color:
                  item.balanceDue === '₹0' ? colors.success : colors.warning,
              },
            ]}>
            Due: {item.balanceDue}
          </Text>
        </View>
      ),
    },
    {
      key: 'status',
      title: 'STATUS',
      width: 130,
      align: 'center',
      render: item => {
        const variant =
          item.status === 'delivered'
            ? 'success'
            : item.status === 'dispatched'
            ? 'info'
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
        title="Sales Orders & Dispatch"
        description="Wholesale and distributor sales order processing, delivery scheduling, and dispatch slips."
        breadcrumb={['LAPTOPAPP', 'Sales & CRM', 'Sales Orders']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Create Order"
              variant="primary"
              size="sm"
              icon="plus"
              onPress={() => {}}
            />
            <AppButton
              title="Dispatch Slip"
              variant="secondary"
              size="sm"
              icon="download"
              onPress={() => {}}
            />
          </View>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {['all', 'pending', 'processing', 'dispatched', 'delivered'].map(
          status => {
            const isSelected = filterStatus === status;
            return (
              <Pressable
                key={status}
                onPress={() => setFilterStatus(status)}
                style={[styles.tab, isSelected && styles.tabActive]}>
                <Text
                  style={[
                    typography.captionMedium,
                    isSelected ? styles.tabTextActive : styles.tabTextInactive,
                  ]}>
                  {status.toUpperCase()}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      <View style={styles.layoutRow}>
        <View style={styles.tableCol}>
          <AppCard
            title="Active Sales Orders"
            subtitle={`${filteredOrders.length} orders shown`}
            action={
              <View style={styles.searchBox}>
                <AppInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search order #, customer..."
                  icon="search"
                  style={styles.searchInput}
                />
              </View>
            }>
            <AppTable
              columns={columns}
              data={filteredOrders}
              keyExtractor={item => item.id}
              onRowPress={item => setSelectedOrder(item)}
            />
          </AppCard>
        </View>

        {selectedOrder && (
          <View style={styles.detailCol}>
            <AppCard
              title="Order Details"
              subtitle={selectedOrder.orderNumber}
              variant="elevated">
              <View style={styles.orderSummary}>
                <View style={styles.summaryItem}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Customer
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedOrder.customerFirm}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Order Date
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedOrder.orderDate}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Target Delivery
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedOrder.deliveryDate}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Grand Total
                  </Text>
                  <Text style={[typography.h3, {color: colors.textPrimary}]}>
                    {selectedOrder.grandTotal}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Advance Received
                  </Text>
                  <Text style={[typography.bodyBold, {color: colors.success}]}>
                    {selectedOrder.advancePaid}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Balance Due
                  </Text>
                  <Text style={[typography.bodyBold, {color: colors.danger}]}>
                    {selectedOrder.balanceDue}
                  </Text>
                </View>
              </View>

              <Text style={[typography.sectionHeading, styles.itemsTitle]}>
                ORDERED COMMODITIES
              </Text>
              {selectedOrder.items.map(it => (
                <View key={it.id} style={styles.lineItem}>
                  <View style={{flex: 1}}>
                    <Text style={[typography.bodyBold, styles.itemTitle]}>
                      {it.productName}
                    </Text>
                    <Text
                      style={[typography.caption, {color: colors.textMuted}]}>
                      {it.quantityBags} bags @ ₹{it.ratePerBag}/bag
                    </Text>
                  </View>
                  <Text
                    style={[typography.bodyBold, {color: colors.textPrimary}]}>
                    ₹{it.totalAmount.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}

              <View style={styles.detailActions}>
                <AppButton
                  title="Generate Invoice"
                  variant="primary"
                  size="sm"
                  icon="invoices"
                  onPress={() => navigate('invoices-billing')}
                />
                <AppButton
                  title="Record Payment"
                  variant="secondary"
                  size="sm"
                  icon="payments"
                  onPress={() => navigate('payments')}
                />
              </View>
            </AppCard>
          </View>
        )}
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
  layoutRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  tableCol: {
    flex: 3,
  },
  detailCol: {
    flex: 1.3,
  },
  searchBox: {
    width: 240,
  },
  searchInput: {
    marginVertical: 0,
  },
  orderSummary: {
    marginBottom: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 47, 77, 0.4)',
  },
  detailLabel: {
    color: colors.textMuted,
  },
  detailVal: {
    color: colors.textPrimary,
  },
  itemsTitle: {
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 47, 77, 0.3)',
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  detailActions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});

export default SalesOrdersScreen;
