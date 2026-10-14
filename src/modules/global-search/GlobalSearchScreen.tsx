import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {SearchCategory, SearchResultItem} from './types';
import PageHeader from '../../shared/components/PageHeader';
import AppInput from '../../shared/components/AppInput';
import AppBadge from '../../shared/components/AppBadge';
import AppCard from '../../shared/components/AppCard';
import AppIcon from '../../shared/components/AppIcon';
import EmptyState from '../../shared/components/EmptyState';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing, radii} from '../../shared/theme/spacing';
import {useNavigation} from '../../navigation/AppNavigator';
import {RouteKey} from '../../navigation/navigationTypes';

const SAMPLE_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: 'res-1',
    category: 'customers',
    title: 'Shri Ram Agro Traders',
    subtitle: 'GSTIN: 27AABCS1429B1Z8 • Phone: +91 98220 11452',
    meta: 'Balance: ₹1,42,800 Dr • Credit Limit: ₹5,00,000',
    badge: 'Customer',
    badgeVariant: 'primary',
    icon: 'customers',
    targetRoute: 'customers',
  },
  {
    id: 'res-2',
    category: 'orders',
    title: 'Sales Order #SO-2026-0891',
    subtitle: 'Shri Ram Agro Traders • 45 Bags Sonam Steamed',
    meta: 'Created: Today, 01:45 PM • ₹84,500',
    badge: 'Order',
    badgeVariant: 'warning',
    icon: 'orders',
    targetRoute: 'sales-orders',
  },
  {
    id: 'res-3',
    category: 'invoices',
    title: 'Tax Invoice #INV-2026-1102',
    subtitle: 'Billed to: Kaveri Grain Suppliers • E-Way Bill Active',
    meta: 'Date: 12-Oct-2026 • ₹1,24,000 • Paid: ₹50,000',
    badge: 'Invoice',
    badgeVariant: 'success',
    icon: 'invoices',
    targetRoute: 'invoices-billing',
  },
  {
    id: 'res-4',
    category: 'products',
    title: 'Royal Basmati Extra Long 1121 (50kg)',
    subtitle: 'SKU: BAS-1121-50KG • Stock: 840 Bags in Warehouse A',
    meta: 'Unit Price: ₹4,200 / Bag • Reorder Level: 200 Bags',
    badge: 'Product',
    badgeVariant: 'info',
    icon: 'products',
    targetRoute: 'products',
  },
  {
    id: 'res-5',
    category: 'scale',
    title: 'Weighbridge Ticket #WB-2026-4410',
    subtitle: 'Vehicle: MH-12-AQ-9812 • Paddy Sona Masoori Raw',
    meta: 'Gross: 24,180 kg • Net: 16,840 kg • Moisture: 13.5%',
    badge: 'Goods Inward',
    badgeVariant: 'neutral',
    icon: 'scale',
    targetRoute: 'goods-inward',
  },
  {
    id: 'res-6',
    category: 'customers',
    title: 'Kaveri Grain Suppliers',
    subtitle: 'GSTIN: 27AABCK8812A1Z1 • Phone: +91 94231 44510',
    meta: 'Balance: ₹48,000 Dr • Nagpur Hub',
    badge: 'Customer',
    badgeVariant: 'primary',
    icon: 'customers',
    targetRoute: 'customers',
  },
];

const CATEGORIES: {key: SearchCategory; label: string}[] = [
  {key: 'all', label: 'All Results'},
  {key: 'customers', label: 'Customers'},
  {key: 'orders', label: 'Orders'},
  {key: 'invoices', label: 'Invoices'},
  {key: 'products', label: 'Products'},
  {key: 'scale', label: 'Weigh Scale'},
];

export const GlobalSearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategory>('all');
  const {navigate} = useNavigation();

  const filteredResults = useMemo(() => {
    return SAMPLE_SEARCH_RESULTS.filter(item => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        query.trim() === '' ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.meta.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader
        title="Global System Search"
        description="Unified search across customer directories, active orders, tax invoices, warehouse stock, and weighbridge slips."
        breadcrumb={['RICEBEE', 'Overview', 'Global Search']}
      />

      {/* Search Input Bar */}
      <AppCard style={styles.searchCard}>
        <AppInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by customer name, order number, vehicle plate, invoice, or product code..."
          icon="search"
          style={styles.searchInput}
        />

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setSelectedCategory(cat.key)}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}>
                <Text
                  style={[
                    typography.captionMedium,
                    isSelected
                      ? styles.chipTextSelected
                      : styles.chipTextUnselected,
                  ]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </AppCard>

      {/* Results Header */}
      <View style={styles.resultMetaRow}>
        <Text style={[typography.bodyMedium, styles.resultCountText]}>
          Showing {filteredResults.length} records found
        </Text>
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Text style={[typography.caption, styles.clearText]}>
              Clear Search
            </Text>
          </Pressable>
        )}
      </View>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <EmptyState
          title="No Matching Records"
          description={`No CRM entities match your search query "${query}". Try searching by another keyword or reset the category filter.`}
          icon="search"
          actionTitle="Reset Search"
          onAction={() => {
            setQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <View style={styles.resultsGrid}>
          {filteredResults.map(item => (
            <Pressable
              key={item.id}
              onPress={() => navigate(item.targetRoute as RouteKey)}
              style={({pressed}) => [
                styles.resultCard,
                pressed && styles.resultCardPressed,
              ]}>
              <View style={styles.resultLeft}>
                <View style={styles.iconCircle}>
                  <AppIcon name={item.icon} size={16} color={colors.primary} />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.resultTitleRow}>
                    <Text style={[typography.h3, styles.resultTitle]}>
                      {item.title}
                    </Text>
                    <AppBadge
                      label={item.badge}
                      variant={item.badgeVariant}
                      size="sm"
                    />
                  </View>
                  <Text style={[typography.body, styles.resultSubtitle]}>
                    {item.subtitle}
                  </Text>
                  <Text style={[typography.caption, styles.resultMeta]}>
                    {item.meta}
                  </Text>
                </View>
              </View>
              <AppIcon name="arrow-right" size={14} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      )}
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
  searchCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  searchInput: {
    marginVertical: 0,
    marginBottom: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: '#0F1A30',
    borderColor: '#243454',
  },
  chipTextSelected: {
    color: '#60A5FA',
    fontWeight: '600',
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
  resultMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultCountText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  clearText: {
    color: colors.primary,
    fontWeight: '600',
  },
  resultsGrid: {
    gap: spacing.sm,
  },
  resultCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultCardPressed: {
    backgroundColor: colors.sidebarHover,
    borderColor: colors.primary,
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  textContainer: {
    flex: 1,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  resultSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: 11,
  },
});

export default GlobalSearchScreen;
