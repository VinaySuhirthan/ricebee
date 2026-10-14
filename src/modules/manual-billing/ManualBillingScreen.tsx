import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import {BillingItem, BillingFormData} from './types';
import PageHeader from '../../shared/components/PageHeader';
import AppCard from '../../shared/components/AppCard';
import AppButton from '../../shared/components/AppButton';
import AppInput from '../../shared/components/AppInput';
import AppTable from '../../shared/components/AppTable';
import AppBadge from '../../shared/components/AppBadge';
import {TableColumn} from '../../shared/types/common';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing, radii} from '../../shared/theme/spacing';
import {useNavigation} from '../../navigation/AppNavigator';

const INITIAL_ITEMS: BillingItem[] = [
  {
    id: 'b-item-1',
    productName: 'Sonam Steamed Rice (50kg Bag)',
    hsnCode: '10063010',
    quantityBags: 20,
    weightKg: 1000,
    ratePerUnit: 1850,
    taxPercent: 5,
    total: 37000,
  },
  {
    id: 'b-item-2',
    productName: 'HMT Kolam Superior (50kg Bag)',
    hsnCode: '10063020',
    quantityBags: 10,
    weightKg: 500,
    ratePerUnit: 1600,
    taxPercent: 5,
    total: 16000,
  },
];

export const ManualBillingScreen: React.FC = () => {
  const [formData, setFormData] = useState<BillingFormData>({
    customerName: 'Shri Ram Agro Traders',
    phone: '+91 98220 11452',
    gstin: '27AABCS1429B1Z8',
    paymentMode: 'Cash',
    discountAmount: 500,
    notes: 'Immediate truck pickup from mill gate #2',
  });

  const [items, setItems] = useState<BillingItem[]>(INITIAL_ITEMS);
  const [newCommodity, setNewCommodity] = useState('');
  const [newBags, setNewBags] = useState('');
  const [newRate, setNewRate] = useState('');
  const {navigate} = useNavigation();

  const handleAddItem = () => {
    if (!newCommodity || !newBags || !newRate) {
      return;
    }
    const bags = parseInt(newBags, 10) || 1;
    const rate = parseFloat(newRate) || 0;
    const newItem: BillingItem = {
      id: `b-item-${Date.now()}`,
      productName: newCommodity,
      hsnCode: '10063090',
      quantityBags: bags,
      weightKg: bags * 50,
      ratePerUnit: rate,
      taxPercent: 5,
      total: bags * rate,
    };
    setItems(prev => [...prev, newItem]);
    setNewCommodity('');
    setNewBags('');
    setNewRate('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = Math.round(subtotal * 0.05);
  const netPayable = subtotal + gstAmount - formData.discountAmount;

  const columns: TableColumn<BillingItem>[] = [
    {
      key: 'productName',
      title: 'COMMODITY / ITEM',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.productName}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            HSN: {item.hsnCode} • {item.weightKg} kg
          </Text>
        </View>
      ),
    },
    {
      key: 'quantityBags',
      title: 'BAGS',
      width: 80,
      align: 'center',
    },
    {
      key: 'ratePerUnit',
      title: 'RATE/BAG',
      width: 110,
      align: 'right',
      render: item => (
        <Text style={[typography.body, {color: colors.textPrimary}]}>
          ₹{item.ratePerUnit}
        </Text>
      ),
    },
    {
      key: 'total',
      title: 'TOTAL',
      width: 120,
      align: 'right',
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
          ₹{item.total.toLocaleString('en-IN')}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: 'ACTION',
      width: 80,
      align: 'center',
      render: item => (
        <Pressable
          onPress={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
          <Text style={{color: colors.danger, fontWeight: '700'}}>✕</Text>
        </Pressable>
      ),
    },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader
        title="Manual Billing & Counter POS"
        description="Quick counter billing, instant retail receipts, custom line items, and live print preview."
        breadcrumb={['RICEBEE', 'Sales & CRM', 'Manual Billing']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Clear All"
              variant="ghost"
              size="sm"
              onPress={() => setItems([])}
            />
            <AppButton
              title="Invoices List"
              variant="secondary"
              size="sm"
              icon="invoices"
              onPress={() => navigate('invoices-billing')}
            />
          </View>
        }
      />

      <View style={styles.layoutRow}>
        {/* Left Form: Customer & Line Items Entry */}
        <View style={styles.leftCol}>
          {/* Customer Info Card */}
          <AppCard
            title="Counter Customer Information"
            subtitle="Walk-in or registered trade partner">
            <View style={styles.formGrid}>
              <View style={styles.formCol}>
                <AppInput
                  label="Customer / Firm Name"
                  value={formData.customerName}
                  onChangeText={txt =>
                    setFormData(p => ({...p, customerName: txt}))
                  }
                  placeholder="e.g. Anand Agro Traders"
                  icon="customers"
                />
              </View>
              <View style={styles.formCol}>
                <AppInput
                  label="Contact Phone"
                  value={formData.phone}
                  onChangeText={txt => setFormData(p => ({...p, phone: txt}))}
                  placeholder="+91 98000 00000"
                  icon="whatsapp"
                />
              </View>
            </View>

            <View style={styles.paymentModesRow}>
              <Text style={[typography.captionMedium, styles.paymentModeLabel]}>
                PAYMENT MODE:
              </Text>
              {(['Cash', 'UPI', 'Bank Transfer', 'Credit'] as const).map(
                mode => {
                  const isSelected = formData.paymentMode === mode;
                  return (
                    <Pressable
                      key={mode}
                      onPress={() =>
                        setFormData(p => ({...p, paymentMode: mode}))
                      }
                      style={[
                        styles.modeChip,
                        isSelected && styles.modeChipSelected,
                      ]}>
                      <Text
                        style={[
                          typography.captionMedium,
                          isSelected
                            ? styles.modeTextSelected
                            : styles.modeTextUnselected,
                        ]}>
                        {mode}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>
          </AppCard>

          {/* Quick Line Item Add */}
          <AppCard
            title="Commodity Line Items"
            subtitle="Add products and bagged grain to bill">
            <View style={styles.itemAddRow}>
              <View style={{flex: 2}}>
                <AppInput
                  placeholder="Commodity / Rice Variety"
                  value={newCommodity}
                  onChangeText={setNewCommodity}
                />
              </View>
              <View style={{flex: 1}}>
                <AppInput
                  placeholder="Bags"
                  value={newBags}
                  onChangeText={setNewBags}
                  keyboardType="numeric"
                />
              </View>
              <View style={{flex: 1}}>
                <AppInput
                  placeholder="Rate/Bag"
                  value={newRate}
                  onChangeText={setNewRate}
                  keyboardType="numeric"
                />
              </View>
              <AppButton
                title="Add Item"
                variant="primary"
                size="md"
                icon="plus"
                onPress={handleAddItem}
                style={styles.addBtn}
              />
            </View>

            <AppTable
              columns={columns}
              data={items}
              keyExtractor={item => item.id}
            />
          </AppCard>
        </View>

        {/* Right Preview Panel */}
        <View style={styles.rightCol}>
          <AppCard
            title="Invoice Preview"
            subtitle="POS Live Estimation"
            variant="accent">
            <View style={styles.previewBox}>
              <View style={styles.previewHeader}>
                <Text style={[typography.h3, styles.previewFirm]}>
                  RICEBEE GRAIN MILL
                </Text>
                <Text style={[typography.caption, {color: colors.textMuted}]}>
                  Plot 12, Industrial Area, Maharashtra
                </Text>
                <Text style={[typography.caption, {color: colors.textMuted}]}>
                  GSTIN: 27AABCR9914M1Z2
                </Text>
              </View>

              <View style={styles.previewDivider} />

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Bill To:</Text>
                <Text style={styles.previewVal}>{formData.customerName}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Date:</Text>
                <Text style={styles.previewVal}>14-Oct-2026</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Payment:</Text>
                <AppBadge
                  label={formData.paymentMode}
                  variant="primary"
                  size="sm"
                />
              </View>

              <View style={styles.previewDivider} />

              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>
                  Subtotal ({items.length} items):
                </Text>
                <Text style={styles.previewVal}>
                  ₹{subtotal.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>GST (5% SGST+CGST):</Text>
                <Text style={styles.previewVal}>
                  ₹{gstAmount.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Special Discount:</Text>
                <Text style={[styles.previewVal, {color: colors.danger}]}>
                  -₹{formData.discountAmount}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={[typography.h3, styles.totalLabel]}>
                  NET AMOUNT
                </Text>
                <Text style={[typography.h2, styles.totalVal]}>
                  ₹{netPayable.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.previewActions}>
                <AppButton
                  title="Generate & Print Receipt"
                  variant="primary"
                  size="md"
                  icon="billing"
                  onPress={() => navigate('invoices-billing')}
                  style={styles.fullBtn}
                />
                <AppButton
                  title="Share on WhatsApp"
                  variant="secondary"
                  size="md"
                  icon="whatsapp"
                  onPress={() => navigate('whatsapp-scheduler')}
                  style={styles.fullBtn}
                />
              </View>
            </View>
          </AppCard>
        </View>
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
  layoutRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  leftCol: {
    flex: 2.2,
  },
  rightCol: {
    flex: 1.3,
  },
  formGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formCol: {
    flex: 1,
  },
  paymentModesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  paymentModeLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  modeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#243454',
    backgroundColor: '#0F1A30',
  },
  modeChipSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  modeTextSelected: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  modeTextUnselected: {
    color: colors.textSecondary,
  },
  itemAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  addBtn: {
    height: 38,
    marginTop: 4,
  },
  previewBox: {
    paddingTop: spacing.xs,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewFirm: {
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  previewDivider: {
    height: 1,
    backgroundColor: 'rgba(30, 47, 77, 0.6)',
    marginVertical: spacing.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  previewLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  previewVal: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    color: colors.textPrimary,
  },
  totalVal: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  previewActions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  fullBtn: {
    width: '100%',
  },
});

export default ManualBillingScreen;
