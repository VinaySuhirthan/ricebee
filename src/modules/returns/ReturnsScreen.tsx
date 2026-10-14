import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ReturnRecord} from './types';
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

const SAMPLE_RETURNS: ReturnRecord[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-2026-0042',
    orderNumber: 'SO-2026-0870',
    customerFirm: 'Kaveri Grain Suppliers',
    commodity: 'HMT Kolam Premium (50kg)',
    bagsReturned: 8,
    reason: 'Packaging Torn',
    creditNoteAmount: '₹12,800',
    status: 'credit-issued',
    createdAt: '2026-10-12T11:00:00',
  },
  {
    id: 'ret-2',
    returnNumber: 'RET-2026-0043',
    orderNumber: 'SO-2026-0881',
    customerFirm: 'Balaji Wholesale Mart',
    commodity: 'Sonam Steamed Rice (50kg)',
    bagsReturned: 15,
    reason: 'Quality / Broken Grains',
    creditNoteAmount: '₹28,155',
    status: 'inspecting',
    createdAt: '2026-10-13T14:30:00',
  },
  {
    id: 'ret-3',
    returnNumber: 'RET-2026-0044',
    orderNumber: 'SO-2026-0889',
    customerFirm: 'Lakshmi Retail Stores',
    commodity: 'Wada Kolam Classic (50kg)',
    bagsReturned: 4,
    reason: 'Excess Dispatch',
    creditNoteAmount: '₹7,340',
    status: 'approved',
    createdAt: '2026-10-14T09:20:00',
  },
];

export const ReturnsScreen: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_RETURNS.filter(
    r =>
      r.returnNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.customerFirm.toLowerCase().includes(search.toLowerCase()) ||
      r.commodity.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: TableColumn<ReturnRecord>[] = [
    {
      key: 'returnNumber',
      title: 'RETURN # & ORDER',
      width: 160,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.primary}]}>
            {item.returnNumber}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            Against {item.orderNumber}
          </Text>
        </View>
      ),
    },
    {
      key: 'customerFirm',
      title: 'CUSTOMER FIRM',
      width: 200,
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
          {item.customerFirm}
        </Text>
      ),
    },
    {
      key: 'commodity',
      title: 'COMMODITY & REASON',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.body, {color: colors.textPrimary}]}>
            {item.commodity} ({item.bagsReturned} bags)
          </Text>
          <Text style={[typography.caption, {color: colors.warning}]}>
            {item.reason}
          </Text>
        </View>
      ),
    },
    {
      key: 'creditNoteAmount',
      title: 'CREDIT NOTE',
      width: 140,
      align: 'right',
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
          {item.creditNoteAmount}
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
          item.status === 'credit-issued'
            ? 'success'
            : item.status === 'approved'
            ? 'info'
            : item.status === 'inspecting'
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
        title="Returns & Credit Notes"
        description="Customer return authorization, mill quality inspection lab, stock restock, and GST credit note generation."
        breadcrumb={['RICEBEE', 'Sales & CRM', 'Returns']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Log Return Request"
              variant="primary"
              size="sm"
              icon="plus"
              onPress={() => {}}
            />
          </View>
        }
      />

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            TOTAL RETURNS
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>27 Bags</Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            This month
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            CREDIT NOTES ISSUED
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>₹48,295</Text>
          <Text style={[typography.caption, {color: colors.success}]}>
            Adjusted in ledger
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            UNDER LAB INSPECTION
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>1 Batch</Text>
          <Text style={[typography.caption, {color: colors.warning}]}>
            Moisture & Broken test
          </Text>
        </View>
      </View>

      <AppCard
        title="Customer Return Slips"
        subtitle={`${filtered.length} claims recorded`}
        action={
          <View style={styles.searchBox}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search return #, customer..."
              icon="search"
              style={styles.searchInput}
            />
          </View>
        }>
        <AppTable
          columns={columns}
          data={filtered}
          keyExtractor={item => item.id}
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
    width: 260,
  },
  searchInput: {
    marginVertical: 0,
  },
});

export default ReturnsScreen;
