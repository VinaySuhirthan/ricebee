import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PaymentRecord} from './types';
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

const SAMPLE_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    receiptNumber: 'REC-2026-0542',
    invoiceNumber: 'INV-2026-1102',
    customerFirm: 'Shri Ram Agro Traders',
    amount: '₹30,000',
    paymentMethod: 'Bank NEFT/RTGS',
    referenceNumber: 'HDFCN26288190',
    paymentDate: 'Today, 11:20 AM',
    status: 'cleared',
    createdAt: '2026-10-14T05:50:00',
  },
  {
    id: 'pay-2',
    receiptNumber: 'REC-2026-0541',
    invoiceNumber: 'INV-2026-1101',
    customerFirm: 'Kaveri Grain Suppliers',
    amount: '₹1,24,000',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/289018449012',
    paymentDate: 'Today, 09:45 AM',
    status: 'cleared',
    createdAt: '2026-10-14T04:15:00',
  },
  {
    id: 'pay-3',
    receiptNumber: 'REC-2026-0540',
    invoiceNumber: 'INV-2026-1088',
    customerFirm: 'Balaji Wholesale Mart',
    amount: '₹2,00,000',
    paymentMethod: 'Cheque',
    referenceNumber: 'CHQ-004419 (SBI)',
    paymentDate: '13-Oct-2026',
    status: 'pending',
    createdAt: '2026-10-13T12:00:00',
  },
  {
    id: 'pay-4',
    receiptNumber: 'REC-2026-0539',
    invoiceNumber: 'INV-2026-1070',
    customerFirm: 'Lakshmi Retail Stores',
    amount: '₹45,000',
    paymentMethod: 'Cash',
    referenceNumber: 'CASH-REC-102',
    paymentDate: '12-Oct-2026',
    status: 'cleared',
    createdAt: '2026-10-12T15:20:00',
  },
];

export const PaymentsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const {navigate} = useNavigation();

  const filteredPayments = useMemo(() => {
    return SAMPLE_PAYMENTS.filter(
      p =>
        p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.customerFirm.toLowerCase().includes(search.toLowerCase()) ||
        p.referenceNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const columns: TableColumn<PaymentRecord>[] = [
    {
      key: 'receiptNumber',
      title: 'RECEIPT & DATE',
      width: 150,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.primary}]}>
            {item.receiptNumber}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.paymentDate}
          </Text>
        </View>
      ),
    },
    {
      key: 'customerFirm',
      title: 'CUSTOMER & INVOICE',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.customerFirm}
          </Text>
          <Text style={[typography.caption, {color: colors.textSecondary}]}>
            Against {item.invoiceNumber}
          </Text>
        </View>
      ),
    },
    {
      key: 'paymentMethod',
      title: 'METHOD & UTR/REF',
      width: 180,
      render: item => (
        <View>
          <Text style={[typography.bodyMedium, {color: colors.textPrimary}]}>
            {item.paymentMethod}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.referenceNumber}
          </Text>
        </View>
      ),
    },
    {
      key: 'amount',
      title: 'AMOUNT RECEIVED',
      width: 140,
      align: 'right',
      render: item => (
        <Text style={[typography.h3, {color: colors.success}]}>
          {item.amount}
        </Text>
      ),
    },
    {
      key: 'status',
      title: 'STATUS',
      width: 110,
      align: 'center',
      render: item => {
        const variant =
          item.status === 'cleared'
            ? 'success'
            : item.status === 'pending'
            ? 'warning'
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
        title="Payments & Settlements"
        description="Cash counter collections, NEFT/RTGS bank settlements, cheque clearing status, and ledger allocation."
        breadcrumb={['LAPTOPAPP', 'Sales & CRM', 'Payments']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Record Payment"
              variant="primary"
              size="sm"
              icon="plus"
              onPress={() => {}}
            />
            <AppButton
              title="Bank Reco"
              variant="secondary"
              size="sm"
              icon="refresh"
              onPress={() => {}}
            />
          </View>
        }
      />

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            COLLECTIONS TODAY
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>₹1,54,000</Text>
          <Text style={[typography.caption, {color: colors.success}]}>
            100% mapped to orders
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            PENDING CHEQUES
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>₹2,00,000</Text>
          <Text style={[typography.caption, {color: colors.warning}]}>
            1 cheque in clearing
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            THIS MONTH TOTAL
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>₹34.6 Lakh</Text>
          <Text style={[typography.caption, {color: colors.info}]}>
            +12% vs last month
          </Text>
        </View>
      </View>

      <AppCard
        title="Payment Transactions"
        subtitle={`${filteredPayments.length} transactions recorded`}
        action={
          <View style={styles.searchBox}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search receipt #, firm, UTR..."
              icon="search"
              style={styles.searchInput}
            />
          </View>
        }>
        <AppTable
          columns={columns}
          data={filteredPayments}
          keyExtractor={item => item.id}
          onRowPress={() => navigate('invoices-billing')}
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
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  metricVal: {
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '700',
  },
  searchBox: {
    width: 280,
  },
  searchInput: {
    marginVertical: 0,
  },
});

export default PaymentsScreen;
