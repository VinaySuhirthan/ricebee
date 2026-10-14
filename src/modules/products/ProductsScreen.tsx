import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {ProductRecord} from './types';
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

const SAMPLE_PRODUCTS: ProductRecord[] = [
  {
    id: 'prod-1',
    sku: 'BAS-1121-50KG',
    name: 'Royal Basmati Extra Long 1121',
    category: 'Raw Basmati',
    bagWeightKg: 50,
    stockBags: 840,
    reorderLevelBags: 200,
    millGatePrice: '₹4,200',
    mrp: '₹4,800',
    warehouseLocation: 'Godown A - Bay 1',
    status: 'in-stock',
    createdAt: '2025-01-10',
  },
  {
    id: 'prod-2',
    sku: 'SON-STM-50KG',
    name: 'Sonam Steamed Rice Premium',
    category: 'Steamed Rice',
    bagWeightKg: 50,
    stockBags: 1250,
    reorderLevelBags: 300,
    millGatePrice: '₹1,850',
    mrp: '₹2,100',
    warehouseLocation: 'Godown B - Bay 4',
    status: 'in-stock',
    createdAt: '2025-02-15',
  },
  {
    id: 'prod-3',
    sku: 'HMT-KLM-50KG',
    name: 'HMT Kolam Superior Polished',
    category: 'Kolam / Parboiled',
    bagWeightKg: 50,
    stockBags: 85,
    reorderLevelBags: 150,
    millGatePrice: '₹1,600',
    mrp: '₹1,850',
    warehouseLocation: 'Godown A - Bay 3',
    status: 'low-stock',
    createdAt: '2025-03-20',
  },
  {
    id: 'prod-4',
    sku: 'WDA-KLM-50KG',
    name: 'Wada Kolam Classic Aged',
    category: 'Kolam / Parboiled',
    bagWeightKg: 50,
    stockBags: 320,
    reorderLevelBags: 100,
    millGatePrice: '₹1,835',
    mrp: '₹2,200',
    warehouseLocation: 'Godown C - Bay 2',
    status: 'in-stock',
    createdAt: '2025-04-05',
  },
  {
    id: 'prod-5',
    sku: 'BRN-POW-40KG',
    name: 'Rice Bran De-Oiled Meal (DOC)',
    category: 'Broken / Bran',
    bagWeightKg: 40,
    stockBags: 0,
    reorderLevelBags: 80,
    millGatePrice: '₹850',
    mrp: '₹1,000',
    warehouseLocation: 'Godown D - Bay 1',
    status: 'out-of-stock',
    createdAt: '2025-05-12',
  },
];

export const ProductsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const {navigate} = useNavigation();

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(p => {
      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.warehouseLocation.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search]);

  const columns: TableColumn<ProductRecord>[] = [
    {
      key: 'sku',
      title: 'SKU CODE',
      width: 140,
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.primary}]}>
          {item.sku}
        </Text>
      ),
    },
    {
      key: 'name',
      title: 'COMMODITY NAME & GODOWN',
      width: 250,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.name}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.category} • {item.warehouseLocation}
          </Text>
        </View>
      ),
    },
    {
      key: 'stockBags',
      title: 'STOCK ON HAND',
      width: 140,
      align: 'right',
      render: item => (
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.stockBags} Bags
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {((item.stockBags * item.bagWeightKg) / 1000).toFixed(1)} Tons
          </Text>
        </View>
      ),
    },
    {
      key: 'millGatePrice',
      title: 'MILL RATE / MRP',
      width: 140,
      align: 'right',
      render: item => (
        <View style={{alignItems: 'flex-end'}}>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.millGatePrice}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            MRP: {item.mrp}
          </Text>
        </View>
      ),
    },
    {
      key: 'status',
      title: 'STOCK STATUS',
      width: 130,
      align: 'center',
      render: item => {
        const variant =
          item.status === 'in-stock'
            ? 'success'
            : item.status === 'low-stock'
            ? 'warning'
            : 'danger';
        return (
          <AppBadge
            label={item.status.replace('-', ' ').toUpperCase()}
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
        title="Product Catalog & Inventory"
        description="Finished rice grain inventory, mill gate pricing, bagged storage locations, and automated reorder alerts."
        breadcrumb={['LAPTOPAPP', 'Warehouse & Supply Chain', 'Products']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Add Commodity"
              variant="primary"
              size="sm"
              icon="plus"
              onPress={() => {}}
            />
            <AppButton
              title="Stock Audit"
              variant="secondary"
              size="sm"
              icon="download"
              onPress={() => {}}
            />
          </View>
        }
      />

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            TOTAL INVENTORY
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>2,495 Bags</Text>
          <Text style={[typography.caption, {color: colors.success}]}>
            124.75 Metric Tons in Mill Silos
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            ACTIVE SKUs
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>18 Varieties</Text>
          <Text style={[typography.caption, {color: colors.info}]}>
            Basmati, Steamed, Kolam, Broken
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[typography.caption, styles.metricLabel]}>
            LOW STOCK WARNING
          </Text>
          <Text style={[typography.h2, styles.metricVal]}>2 Varieties</Text>
          <Text style={[typography.caption, {color: colors.warning}]}>
            HMT Kolam & Rice Bran DOC
          </Text>
        </View>
      </View>

      <View style={styles.tabsRow}>
        {[
          'all',
          'Raw Basmati',
          'Steamed Rice',
          'Kolam / Parboiled',
          'Broken / Bran',
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
                {cat.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppCard
        title="Commodity Stock Register"
        subtitle={`${filteredProducts.length} items listed`}
        action={
          <View style={styles.searchBox}>
            <AppInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search SKU, grain name, bay..."
              icon="search"
              style={styles.searchInput}
            />
          </View>
        }>
        <AppTable
          columns={columns}
          data={filteredProducts}
          keyExtractor={item => item.id}
          onRowPress={() => navigate('manual-billing')}
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
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});

export default ProductsScreen;
