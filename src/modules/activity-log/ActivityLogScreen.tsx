import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {ActivityLogEntry} from './types';
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

const SAMPLE_LOGS: ActivityLogEntry[] = [
  {
    id: 'log-1',
    user: 'Operator Ramesh',
    role: 'Weighbridge Lead',
    action: 'Captured Tare Weight for MH-12-AQ-9812',
    details:
      'Net Weight calculated: 16,840 kg of Paddy Sona Masoori Raw. Slip generated.',
    ipAddress: '192.168.1.104',
    device: 'Windows Weigh Terminal 01',
    category: 'WEIGHBRIDGE',
    timestamp: 'Today, 08:15 AM',
    status: 'SUCCESS',
    createdAt: '2026-10-14T08:15:00',
  },
  {
    id: 'log-2',
    user: 'Cashier Priya',
    role: 'Billing Operator',
    action: 'Generated Counter Bill INV-2026-1102',
    details:
      'Total: ₹84,500. Cash advance ₹30,000 received and receipt printed.',
    ipAddress: '192.168.1.112',
    device: 'Windows POS Terminal 02',
    category: 'BILLING',
    timestamp: 'Today, 08:00 AM',
    status: 'SUCCESS',
    createdAt: '2026-10-14T08:00:00',
  },
  {
    id: 'log-3',
    user: 'Manager Vikram',
    role: 'General Manager',
    action: 'Approved Manual Credit Override',
    details:
      'Increased credit ceiling temporarily for Shri Ram Agro Traders by ₹1,00,000.',
    ipAddress: '192.168.1.50',
    device: 'Laptop Executive App',
    category: 'SECURITY',
    timestamp: 'Today, 07:40 AM',
    status: 'WARNING',
    createdAt: '2026-10-14T07:40:00',
  },
  {
    id: 'log-4',
    user: 'Warehouse Suresh',
    role: 'Godown Supervisor',
    action: 'Stock Transfer Between Silos',
    details:
      'Moved 300 bags Sonam Steamed from Godown B to Dispatch Staging Area.',
    ipAddress: '192.168.1.109',
    device: 'Warehouse Handheld Windows Tablet',
    category: 'INVENTORY',
    timestamp: 'Yesterday, 06:10 PM',
    status: 'SUCCESS',
    createdAt: '2026-10-13T18:10:00',
  },
  {
    id: 'log-5',
    user: 'System Automated Bot',
    role: 'Background Daemon',
    action: 'Sync GST E-Way Bill Portal',
    details:
      'Synced 14 dispatch slips with government portal. All tokens valid.',
    ipAddress: '127.0.0.1',
    device: 'Local Mill Server',
    category: 'SYSTEM',
    timestamp: 'Yesterday, 05:00 PM',
    status: 'SUCCESS',
    createdAt: '2026-10-13T17:00:00',
  },
];

export const ActivityLogScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return SAMPLE_LOGS.filter(log => {
      const matchesCat =
        categoryFilter === 'ALL' || log.category === categoryFilter;
      const matchesSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.device.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, search]);

  const columns: TableColumn<ActivityLogEntry>[] = [
    {
      key: 'timestamp',
      title: 'TIMESTAMP & DEVICE',
      width: 170,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.timestamp}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.device}
          </Text>
        </View>
      ),
    },
    {
      key: 'user',
      title: 'OPERATOR & ROLE',
      width: 180,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.primary}]}>
            {item.user}
          </Text>
          <Text style={[typography.caption, {color: colors.textSecondary}]}>
            {item.role}
          </Text>
        </View>
      ),
    },
    {
      key: 'action',
      title: 'ACTION & AUDIT DETAILS',
      width: 320,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.action}
          </Text>
          <Text style={[typography.caption, {color: colors.textSecondary}]}>
            {item.details}
          </Text>
        </View>
      ),
    },
    {
      key: 'category',
      title: 'CATEGORY',
      width: 130,
      align: 'center',
      render: item => (
        <AppBadge
          label={item.category}
          variant={
            item.category === 'SECURITY'
              ? 'danger'
              : item.category === 'BILLING'
              ? 'success'
              : item.category === 'WEIGHBRIDGE'
              ? 'warning'
              : 'info'
          }
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      title: 'RESULT',
      width: 100,
      align: 'center',
      render: item => {
        const variant =
          item.status === 'SUCCESS'
            ? 'success'
            : item.status === 'WARNING'
            ? 'warning'
            : 'danger';
        return <AppBadge label={item.status} variant={variant} size="sm" />;
      },
    },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader
        title="Audit Trail & Activity Log"
        description="Immutable enterprise audit trail, user authentication sessions, weighment overrides, and billing changes."
        breadcrumb={['RICEBEE', 'System', 'Activity Log']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Export Audit CSV"
              variant="primary"
              size="sm"
              icon="download"
              onPress={() => {}}
            />
          </View>
        }
      />

      {/* Category Tabs */}
      <View style={styles.tabsRow}>
        {[
          'ALL',
          'WEIGHBRIDGE',
          'BILLING',
          'INVENTORY',
          'SECURITY',
          'SYSTEM',
        ].map(cat => {
          const isSelected = categoryFilter === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategoryFilter(cat)}
              style={[styles.tab, isSelected && styles.tabActive]}>
              <Text
                style={[
                  typography.captionMedium,
                  isSelected ? styles.tabTextActive : styles.tabTextInactive,
                ]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppCard
        title="Audit Event Records"
        subtitle={`${filteredLogs.length} verified events`}
        action={
          <View style={styles.searchBox}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search user, action, details..."
              icon="search"
              style={styles.searchInput}
            />
          </View>
        }>
        <AppTable
          columns={columns}
          data={filteredLogs}
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
    width: 260,
  },
  searchInput: {
    marginVertical: 0,
  },
});

export default ActivityLogScreen;
