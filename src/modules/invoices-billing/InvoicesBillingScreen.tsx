import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {InvoiceRecord} from './types';
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

const SAMPLE_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-1102',
    orderNumber: 'SO-2026-0891',
    customerFirm: 'Shri Ram Agro Traders',
    customerGstin: '27AABCS1429B1Z8',
    issueDate: '14-Oct-2026',
    dueDate: '21-Oct-2026',
    subtotal: '₹80,476',
    taxAmount: '₹4,024',
    grandTotal: '₹84,500',
    paidAmount: '₹30,000',
    dueAmount: '₹54,500',
    status: 'partially-paid',
    ewayBillNumber: 'EB-271982141',
    createdAt: '2026-10-14T09:00:00',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-1101',
    orderNumber: 'SO-2026-0890',
    customerFirm: 'Kaveri Grain Suppliers',
    customerGstin: '27AABCK8812A1Z1',
    issueDate: '13-Oct-2026',
    dueDate: '20-Oct-2026',
    subtotal: '₹1,18,095',
    taxAmount: '₹5,905',
    grandTotal: '₹1,24,000',
    paidAmount: '₹1,24,000',
    dueAmount: '₹0',
    status: 'paid',
    ewayBillNumber: 'EB-271982140',
    createdAt: '2026-10-13T14:30:00',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-1100',
    orderNumber: 'SO-2026-0885',
    customerFirm: 'Maa Durga Grain Agency',
    customerGstin: '10AAACJ9941K1Z2',
    issueDate: '01-Oct-2026',
    dueDate: '08-Oct-2026',
    subtotal: '₹2,40,000',
    taxAmount: '₹12,000',
    grandTotal: '₹2,52,000',
    paidAmount: '₹0',
    dueAmount: '₹2,52,000',
    status: 'overdue',
    createdAt: '2026-10-01T10:15:00',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-1099',
    orderNumber: 'SO-2026-0884',
    customerFirm: 'Balaji Wholesale Mart',
    customerGstin: '36AAGCB7714C1Z4',
    issueDate: '10-Oct-2026',
    dueDate: '25-Oct-2026',
    subtotal: '₹5,16,380',
    taxAmount: '₹25,820',
    grandTotal: '₹5,42,200',
    paidAmount: '₹0',
    dueAmount: '₹5,42,200',
    status: 'unpaid',
    ewayBillNumber: 'EB-361109481',
    createdAt: '2026-10-10T16:00:00',
  },
];

export const InvoicesBillingScreen: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const {navigate} = useNavigation();

  const filteredInvoices = useMemo(() => {
    return SAMPLE_INVOICES.filter(inv => {
      const matchesStatus =
        statusFilter === 'all' || inv.status === statusFilter;
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerFirm.toLowerCase().includes(search.toLowerCase()) ||
        (inv.ewayBillNumber && inv.ewayBillNumber.includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, search]);

  const columns: TableColumn<InvoiceRecord>[] = [
    {
      key: 'invoiceNumber',
      title: 'INVOICE #',
      width: 140,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.primary}]}>
            {item.invoiceNumber}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.issueDate}
          </Text>
        </View>
      ),
    },
    {
      key: 'customerFirm',
      title: 'CUSTOMER FIRM & GSTIN',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.customerFirm}
          </Text>
          <Text style={[typography.caption, {color: colors.textSecondary}]}>
            GSTIN: {item.customerGstin}
          </Text>
        </View>
      ),
    },
    {
      key: 'grandTotal',
      title: 'INVOICE AMOUNT',
      width: 140,
      align: 'right',
      render: item => (
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.grandTotal}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            Tax: {item.taxAmount}
          </Text>
        </View>
      ),
    },
    {
      key: 'dueAmount',
      title: 'BALANCE DUE',
      width: 130,
      align: 'right',
      render: item => (
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={[
              typography.bodyBold,
              {color: item.dueAmount === '₹0' ? colors.success : colors.danger},
            ]}>
            {item.dueAmount}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            Due by {item.dueDate}
          </Text>
        </View>
      ),
    },
    {
      key: 'ewayBillNumber',
      title: 'E-WAY BILL',
      width: 130,
      align: 'center',
      render: item =>
        item.ewayBillNumber ? (
          <AppBadge label={item.ewayBillNumber} variant="neutral" size="sm" />
        ) : (
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            N/A
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
          item.status === 'paid'
            ? 'success'
            : item.status === 'partially-paid'
            ? 'warning'
            : item.status === 'overdue'
            ? 'danger'
            : 'neutral';
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
        title="Invoices & Tax Billing"
        description="GST tax invoices, automated E-Way bill generation, payment aging schedule, and customer ledgers."
        breadcrumb={['LAPTOPAPP', 'Sales & CRM', 'Invoices & Billing']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Manual Bill"
              variant="secondary"
              size="sm"
              icon="billing"
              onPress={() => navigate('manual-billing')}
            />
            <AppButton
              title="GST Summary"
              variant="primary"
              size="sm"
              icon="download"
              onPress={() => {}}
            />
          </View>
        }
      />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['all', 'paid', 'partially-paid', 'unpaid', 'overdue'].map(st => {
          const isSelected = statusFilter === st;
          return (
            <Pressable
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[styles.tab, isSelected && styles.tabActive]}>
              <Text
                style={[
                  typography.captionMedium,
                  isSelected ? styles.tabTextActive : styles.tabTextInactive,
                ]}>
                {st.replace('-', ' ').toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppCard
        title="Tax Invoices Register"
        subtitle={`${filteredInvoices.length} billing documents recorded`}
        action={
          <View style={styles.searchBox}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search invoice #, firm, e-way bill..."
              icon="search"
              style={styles.searchInput}
            />
          </View>
        }>
        <AppTable
          columns={columns}
          data={filteredInvoices}
          keyExtractor={item => item.id}
          onRowPress={() => navigate('payments')}
        />
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
  searchBox: {
    width: 280,
  },
  searchInput: {
    marginVertical: 0,
  },
});

export default InvoicesBillingScreen;
