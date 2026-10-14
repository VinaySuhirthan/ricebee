import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {CustomerRecord} from './types';
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

const SAMPLE_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Rajesh Agrawal',
    firmName: 'Shri Ram Agro Traders',
    phone: '+91 98220 11452',
    email: 'rajesh@shriramagro.com',
    city: 'Nagpur',
    state: 'Maharashtra',
    gstin: '27AABCS1429B1Z8',
    creditLimit: '₹5,00,000',
    outstandingBalance: '₹1,42,800',
    status: 'active',
    category: 'Wholesale',
    createdAt: '2025-04-12',
  },
  {
    id: 'cust-2',
    name: 'Suresh Patil',
    firmName: 'Kaveri Grain Suppliers',
    phone: '+91 94231 44510',
    email: 'kaveri.grains@gmail.com',
    city: 'Amravati',
    state: 'Maharashtra',
    gstin: '27AABCK8812A1Z1',
    creditLimit: '₹3,00,000',
    outstandingBalance: '₹48,000',
    status: 'active',
    category: 'Distributor',
    createdAt: '2025-06-20',
  },
  {
    id: 'cust-3',
    name: 'Venkatesh Rao',
    firmName: 'Balaji Wholesale Mart',
    phone: '+91 99890 22341',
    email: 'balajiwholesale@gmail.com',
    city: 'Hyderabad',
    state: 'Telangana',
    gstin: '36AAGCB7714C1Z4',
    creditLimit: '₹10,00,000',
    outstandingBalance: '₹3,15,400',
    status: 'active',
    category: 'Wholesale',
    createdAt: '2025-01-15',
  },
  {
    id: 'cust-4',
    name: 'Pooja Deshmukh',
    firmName: 'Lakshmi Retail Stores',
    phone: '+91 98901 33214',
    email: 'lakshmistore@yahoo.com',
    city: 'Wardha',
    state: 'Maharashtra',
    gstin: '27AAMCD6621F1ZX',
    creditLimit: '₹1,50,000',
    outstandingBalance: '₹12,450',
    status: 'verified',
    category: 'Retailer',
    createdAt: '2025-08-04',
  },
  {
    id: 'cust-5',
    name: 'Anand Kumar Jha',
    firmName: 'Maa Durga Grain Agency',
    phone: '+91 93340 55120',
    email: 'maadurgagrains@gmail.com',
    city: 'Patna',
    state: 'Bihar',
    gstin: '10AAACJ9941K1Z2',
    creditLimit: '₹8,00,000',
    outstandingBalance: '₹6,40,000',
    status: 'suspended',
    category: 'Broker',
    createdAt: '2024-11-28',
  },
];

export const CustomersScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(SAMPLE_CUSTOMERS[0]);
  const {navigate} = useNavigation();

  const filteredCustomers = useMemo(() => {
    return SAMPLE_CUSTOMERS.filter(
      c =>
        c.firmName.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search),
    );
  }, [search]);

  const columns: TableColumn<CustomerRecord>[] = [
    {
      key: 'firmName',
      title: 'FIRM / CUSTOMER',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.firmName}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.name} • {item.city}
          </Text>
        </View>
      ),
    },
    {
      key: 'phone',
      title: 'CONTACT & GSTIN',
      width: 190,
      render: item => (
        <View>
          <Text style={[typography.body, {color: colors.textSecondary}]}>
            {item.phone}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.gstin}
          </Text>
        </View>
      ),
    },
    {
      key: 'category',
      title: 'CATEGORY',
      width: 120,
      align: 'center',
      render: item => (
        <AppBadge
          label={item.category}
          variant={item.category === 'Wholesale' ? 'primary' : 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'outstandingBalance',
      title: 'BALANCE',
      width: 140,
      align: 'right',
      render: item => (
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.outstandingBalance}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            Limit: {item.creditLimit}
          </Text>
        </View>
      ),
    },
    {
      key: 'status',
      title: 'STATUS',
      width: 110,
      align: 'center',
      render: item => {
        const variant =
          item.status === 'active'
            ? 'success'
            : item.status === 'verified'
            ? 'info'
            : 'danger';
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
        title="Customers & Accounts"
        description="Customer directory with GST verification, credit limit ledger, outstanding receivables, and order history."
        breadcrumb={['RICEBEE', 'Sales & CRM', 'Customers']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Add Customer"
              variant="primary"
              size="sm"
              icon="plus"
              onPress={() => {}}
            />
            <AppButton
              title="Export List"
              variant="secondary"
              size="sm"
              icon="download"
              onPress={() => {}}
            />
          </View>
        }
      />

      {/* Summary KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={styles.summaryCard}>
          <Text style={[typography.caption, styles.summaryLabel]}>
            TOTAL ACCOUNTS
          </Text>
          <Text style={[typography.h2, styles.summaryVal]}>1,420</Text>
          <Text style={[typography.caption, {color: colors.success}]}>
            +18 new this month
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[typography.caption, styles.summaryLabel]}>
            OUTSTANDING LEDGER
          </Text>
          <Text style={[typography.h2, styles.summaryVal]}>₹42.8 Lakh</Text>
          <Text style={[typography.caption, {color: colors.warning}]}>
            8 accounts over credit limit
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[typography.caption, styles.summaryLabel]}>
            GST VERIFIED
          </Text>
          <Text style={[typography.h2, styles.summaryVal]}>98.4%</Text>
          <Text style={[typography.caption, {color: colors.info}]}>
            Auto-synced with portal
          </Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.layoutRow}>
        <View style={styles.tableCol}>
          <AppCard
            title="Customer Registry"
            subtitle={`${filteredCustomers.length} registered trade partners`}
            action={
              <View style={styles.searchWrapper}>
                <AppInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Filter by name, phone, city..."
                  icon="search"
                  style={styles.searchInput}
                />
              </View>
            }>
            <AppTable
              columns={columns}
              data={filteredCustomers}
              keyExtractor={item => item.id}
              onRowPress={item => setSelectedCustomer(item)}
            />
          </AppCard>
        </View>

        {/* Selected Customer Quick Profile */}
        {selectedCustomer && (
          <View style={styles.detailCol}>
            <AppCard
              title="Customer Profile"
              subtitle={selectedCustomer.firmName}
              variant="elevated">
              <View style={styles.detailBody}>
                <View style={styles.detailRow}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Proprietor
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedCustomer.name}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Phone
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedCustomer.phone}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    GSTIN
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedCustomer.gstin}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Location
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedCustomer.city}, {selectedCustomer.state}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Outstanding
                  </Text>
                  <Text style={[typography.bodyBold, {color: colors.danger}]}>
                    {selectedCustomer.outstandingBalance}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[typography.caption, styles.detailLabel]}>
                    Credit Limit
                  </Text>
                  <Text style={[typography.bodyMedium, styles.detailVal]}>
                    {selectedCustomer.creditLimit}
                  </Text>
                </View>

                <View style={styles.detailActions}>
                  <AppButton
                    title="New Sales Order"
                    variant="primary"
                    size="sm"
                    icon="orders"
                    onPress={() => navigate('sales-orders')}
                    style={styles.actionBtnFull}
                  />
                  <AppButton
                    title="Send WhatsApp Reminder"
                    variant="secondary"
                    size="sm"
                    icon="whatsapp"
                    onPress={() => navigate('whatsapp-scheduler')}
                    style={styles.actionBtnFull}
                  />
                </View>
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
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  summaryVal: {
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '700',
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
  searchWrapper: {
    width: 260,
  },
  searchInput: {
    marginVertical: 0,
  },
  detailBody: {
    paddingTop: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 47, 77, 0.4)',
  },
  detailLabel: {
    color: colors.textMuted,
  },
  detailVal: {
    color: colors.textPrimary,
  },
  detailActions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionBtnFull: {
    width: '100%',
  },
});

export default CustomersScreen;
