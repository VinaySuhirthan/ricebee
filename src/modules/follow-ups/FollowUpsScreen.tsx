import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {FollowUpRecord} from './types';
import PageHeader from '../../shared/components/PageHeader';
import AppCard from '../../shared/components/AppCard';
import AppBadge from '../../shared/components/AppBadge';
import AppButton from '../../shared/components/AppButton';
import AppIcon from '../../shared/components/AppIcon';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing, radii} from '../../shared/theme/spacing';
import {useNavigation} from '../../navigation/AppNavigator';

const SAMPLE_FOLLOWUPS: FollowUpRecord[] = [
  {
    id: 'fup-1',
    customerFirm: 'Shri Ram Agro Traders',
    contactPerson: 'Rajesh Agrawal',
    phone: '+91 98220 11452',
    type: 'payment',
    priority: 'high',
    dueDate: 'Today, 03:00 PM',
    notes: 'Confirm NEFT UTR for ₹54,500 balance for invoice INV-2026-1102.',
    amountExpected: '₹54,500',
    isCompleted: false,
    createdAt: '2026-10-14T07:00:00',
  },
  {
    id: 'fup-2',
    customerFirm: 'Maa Durga Grain Agency',
    contactPerson: 'Anand Kumar Jha',
    phone: '+91 93340 55120',
    type: 'payment',
    priority: 'high',
    dueDate: 'Today, 05:00 PM',
    notes:
      'Overdue balance ₹6,40,000 crossed 30 days. Send legal draft reminder.',
    amountExpected: '₹2,52,000',
    isCompleted: false,
    createdAt: '2026-10-14T08:30:00',
  },
  {
    id: 'fup-3',
    customerFirm: 'Kaveri Grain Suppliers',
    contactPerson: 'Suresh Patil',
    phone: '+91 94231 44510',
    type: 'order-reorder',
    priority: 'medium',
    dueDate: 'Tomorrow',
    notes: 'Check if weekly 100-bag HMT Kolam replenishment order is ready.',
    isCompleted: false,
    createdAt: '2026-10-13T10:00:00',
  },
  {
    id: 'fup-4',
    customerFirm: 'Balaji Wholesale Mart',
    contactPerson: 'Venkatesh Rao',
    phone: '+91 99890 22341',
    type: 'dispatch',
    priority: 'medium',
    dueDate: '16-Oct-2026',
    notes: 'Confirm transport truck arrival for 250 bags Basmati dispatch.',
    isCompleted: true,
    createdAt: '2026-10-12T14:00:00',
  },
];

export const FollowUpsScreen: React.FC = () => {
  const [followups, setFollowups] =
    useState<FollowUpRecord[]>(SAMPLE_FOLLOWUPS);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const {navigate} = useNavigation();

  const toggleComplete = (id: string) => {
    setFollowups(prev =>
      prev.map(f => (f.id === id ? {...f, isCompleted: !f.isCompleted} : f)),
    );
  };

  const filtered = followups.filter(
    f => priorityFilter === 'all' || f.priority === priorityFilter,
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader
        title="Customer Follow-ups"
        description="High-priority receivable chasing, recurring re-order calls, delivery check-ins, and scheduled sales tasks."
        breadcrumb={['RICEBEE', 'Sales & CRM', 'Follow-ups']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Add Follow-up"
              variant="primary"
              size="sm"
              icon="plus"
              onPress={() => {}}
            />
            <AppButton
              title="WhatsApp Scheduler"
              variant="secondary"
              size="sm"
              icon="whatsapp"
              onPress={() => navigate('whatsapp-scheduler')}
            />
          </View>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {['all', 'high', 'medium', 'low'].map(p => {
          const isSelected = priorityFilter === p;
          return (
            <Pressable
              key={p}
              onPress={() => setPriorityFilter(p)}
              style={[styles.tab, isSelected && styles.tabActive]}>
              <Text
                style={[
                  typography.captionMedium,
                  isSelected ? styles.tabTextActive : styles.tabTextInactive,
                ]}>
                {p.toUpperCase()} PRIORITY
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppCard
        title="Pending Follow-up Tasks"
        subtitle={`${
          filtered.filter(f => !f.isCompleted).length
        } active action items`}>
        <View style={styles.listContainer}>
          {filtered.map(item => (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                item.isCompleted && styles.itemCardDone,
              ]}>
              <Pressable
                onPress={() => toggleComplete(item.id)}
                style={styles.checkbox}>
                {item.isCompleted ? (
                  <Text style={styles.checkedText}>✓</Text>
                ) : (
                  <View style={styles.uncheckedBox} />
                )}
              </Pressable>

              <View style={styles.itemContent}>
                <View style={styles.itemTopRow}>
                  <Text
                    style={[
                      typography.bodyBold,
                      styles.firmTitle,
                      item.isCompleted && styles.completedText,
                    ]}>
                    {item.customerFirm}
                  </Text>
                  <View style={styles.badgesGroup}>
                    {item.amountExpected && (
                      <AppBadge
                        label={`Exp: ${item.amountExpected}`}
                        variant="warning"
                        size="sm"
                      />
                    )}
                    <AppBadge
                      label={item.priority.toUpperCase()}
                      variant={
                        item.priority === 'high'
                          ? 'danger'
                          : item.priority === 'medium'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    />
                  </View>
                </View>

                <Text style={[typography.body, styles.notesText]}>
                  {item.notes}
                </Text>

                <View style={styles.itemFooter}>
                  <View style={styles.metaRow}>
                    <AppIcon name="user" size={12} color={colors.textMuted} />
                    <Text style={[typography.caption, styles.metaText]}>
                      {item.contactPerson} ({item.phone})
                    </Text>
                    <Text style={styles.metaDivider}>•</Text>
                    <AppIcon name="clock" size={12} color={colors.textMuted} />
                    <Text style={[typography.caption, styles.metaText]}>
                      {item.dueDate}
                    </Text>
                  </View>

                  <View style={styles.itemActions}>
                    <AppButton
                      title="WhatsApp"
                      variant="ghost"
                      size="sm"
                      icon="whatsapp"
                      onPress={() => navigate('whatsapp-scheduler')}
                    />
                    <AppButton
                      title="Ledger"
                      variant="ghost"
                      size="sm"
                      icon="customers"
                      onPress={() => navigate('customers')}
                    />
                  </View>
                </View>
              </View>
            </View>
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
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.sm,
    padding: spacing.lg,
  },
  itemCardDone: {
    opacity: 0.5,
    backgroundColor: '#0A1220',
  },
  checkbox: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  uncheckedBox: {
    width: 20,
    height: 20,
    borderRadius: radii.xs,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  checkedText: {
    width: 20,
    height: 20,
    borderRadius: radii.xs,
    backgroundColor: colors.success,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  firmTitle: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  badgesGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  notesText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.textMuted,
    marginLeft: 4,
  },
  metaDivider: {
    color: colors.textMuted,
    marginHorizontal: 8,
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});

export default FollowUpsScreen;
