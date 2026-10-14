import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {WeighScaleTicket} from './types';
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

const SAMPLE_TICKETS: WeighScaleTicket[] = [
  {
    id: 'wb-1',
    ticketNumber: 'WB-2026-4410',
    vehicleNumber: 'MH-12-AQ-9812',
    driverName: 'Rameshwar Yadav',
    supplierName: 'Kisan Krishi Sahakari Mandi',
    paddyVariety: 'Paddy Sona Masoori Raw',
    grossWeightKg: 24180,
    tareWeightKg: 7340,
    netWeightKg: 16840,
    bagsCount: 336,
    moisturePercent: 13.5,
    deductionKg: 120,
    finalWeightKg: 16720,
    status: 'completed',
    createdAt: '2026-10-14T07:45:00',
  },
  {
    id: 'wb-2',
    ticketNumber: 'WB-2026-4411',
    vehicleNumber: 'MH-31-CB-5541',
    driverName: 'Sanjay Shinde',
    supplierName: 'Vikas Agro Farms',
    paddyVariety: 'Paddy HMT Grade A',
    grossWeightKg: 28450,
    tareWeightKg: 0,
    netWeightKg: 0,
    bagsCount: 410,
    moisturePercent: 14.2,
    deductionKg: 0,
    finalWeightKg: 0,
    status: 'gross-weighed',
    createdAt: '2026-10-14T08:30:00',
  },
  {
    id: 'wb-3',
    ticketNumber: 'WB-2026-4409',
    vehicleNumber: 'CG-04-MB-1122',
    driverName: 'Dilip Kumar',
    supplierName: 'Raipur Grain Mandi',
    paddyVariety: 'Paddy 1010 Hybrid',
    grossWeightKg: 31200,
    tareWeightKg: 8900,
    netWeightKg: 22300,
    bagsCount: 440,
    moisturePercent: 12.8,
    deductionKg: 80,
    finalWeightKg: 22220,
    status: 'completed',
    createdAt: '2026-10-14T06:15:00',
  },
];

export const GoodsInwardScreen: React.FC = () => {
  const [scaleReading, setScaleReading] = useState('28,450');
  const [isStable] = useState(true);
  const [vehicleNo, setVehicleNo] = useState('MH-31-CB-5541');
  const [supplier, setSupplier] = useState('Vikas Agro Farms');
  const [variety, setVariety] = useState('Paddy HMT Grade A');
  const [moisture, setMoisture] = useState('14.2');

  const columns: TableColumn<WeighScaleTicket>[] = [
    {
      key: 'ticketNumber',
      title: 'TICKET #',
      width: 130,
      render: item => (
        <Text style={[typography.bodyBold, {color: colors.primary}]}>
          {item.ticketNumber}
        </Text>
      ),
    },
    {
      key: 'vehicleNumber',
      title: 'VEHICLE & DRIVER',
      width: 170,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.vehicleNumber}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.driverName}
          </Text>
        </View>
      ),
    },
    {
      key: 'supplierName',
      title: 'SUPPLIER & GRAIN',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.supplierName}
          </Text>
          <Text style={[typography.caption, {color: colors.textSecondary}]}>
            {item.paddyVariety} • Moisture: {item.moisturePercent}%
          </Text>
        </View>
      ),
    },
    {
      key: 'grossWeightKg',
      title: 'GROSS WT',
      width: 110,
      align: 'right',
      render: item => (
        <Text style={[typography.body, {color: colors.textPrimary}]}>
          {item.grossWeightKg.toLocaleString('en-IN')} kg
        </Text>
      ),
    },
    {
      key: 'finalWeightKg',
      title: 'NET FINAL',
      width: 120,
      align: 'right',
      render: item => (
        <Text
          style={[
            typography.bodyBold,
            {color: item.finalWeightKg > 0 ? colors.success : colors.warning},
          ]}>
          {item.finalWeightKg > 0
            ? `${(item.finalWeightKg / 1000).toFixed(2)} Tons`
            : 'Pending Tare'}
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
          item.status === 'completed'
            ? 'success'
            : item.status === 'gross-weighed'
            ? 'warning'
            : 'info';
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
        title="POS — Goods Inward Scale"
        description="Weighbridge terminal interface, gross/tare vehicle weighing, moisture laboratory analysis, and paddy inward slips."
        breadcrumb={[
          'RICEBEE',
          'Warehouse & Supply Chain',
          'Goods Inward Scale',
        ]}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="Calibrate Scale"
              variant="secondary"
              size="sm"
              icon="scale"
              onPress={() => {}}
            />
            <AppButton
              title="Print Last Ticket"
              variant="primary"
              size="sm"
              icon="download"
              onPress={() => {}}
            />
          </View>
        }
      />

      <View style={styles.layoutRow}>
        {/* Left Weighbridge Console */}
        <View style={styles.leftCol}>
          {/* Digital Scale Indicator */}
          <AppCard
            title="Weighbridge Live Terminal"
            subtitle="COM Port 1 • Toledo Indicator Digital Link">
            <View style={styles.scaleDisplayContainer}>
              <View style={styles.indicatorStatusRow}>
                <View style={styles.statusPill}>
                  <View style={styles.greenPulse} />
                  <Text style={styles.statusPillText}>
                    {isStable ? 'SCALE STABLE' : 'MOTION DETECTED'}
                  </Text>
                </View>
                <Text style={styles.zeroTrackText}>ZERO TRACK: OK</Text>
              </View>

              <View style={styles.scaleValueBox}>
                <Text style={styles.scaleNumber}>{scaleReading}</Text>
                <Text style={styles.scaleUnit}>KG</Text>
              </View>

              <View style={styles.scaleButtonsRow}>
                <AppButton
                  title="Capture Gross Wt"
                  variant="primary"
                  size="md"
                  icon="scale"
                  onPress={() => setScaleReading('28,450')}
                  style={styles.scaleBtn}
                />
                <AppButton
                  title="Capture Tare Wt"
                  variant="secondary"
                  size="md"
                  icon="refresh"
                  onPress={() => setScaleReading('7,340')}
                  style={styles.scaleBtn}
                />
                <AppButton
                  title="Re-Zero"
                  variant="ghost"
                  size="md"
                  onPress={() => setScaleReading('0')}
                />
              </View>
            </View>
          </AppCard>

          {/* Ticket Entry Form */}
          <AppCard
            title="Weighment Ticket Details"
            subtitle="Inward Paddy / Raw Grain Consignment">
            <View style={styles.formGrid}>
              <View style={styles.formCol}>
                <AppInput
                  label="Vehicle Number (Truck/Tractor)"
                  value={vehicleNo}
                  onChangeText={setVehicleNo}
                  placeholder="e.g. MH-12-AQ-9812"
                />
              </View>
              <View style={styles.formCol}>
                <AppInput
                  label="Supplier / Mandi Name"
                  value={supplier}
                  onChangeText={setSupplier}
                  placeholder="e.g. Kisan Mandi"
                  icon="customers"
                />
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formCol}>
                <AppInput
                  label="Paddy Variety"
                  value={variety}
                  onChangeText={setVariety}
                  placeholder="e.g. Paddy 1010 Raw"
                />
              </View>
              <View style={styles.formCol}>
                <AppInput
                  label="Moisture % (Standard: 14%)"
                  value={moisture}
                  onChangeText={setMoisture}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.ticketActions}>
              <AppButton
                title="Generate Inward Slip & Open Gate"
                variant="primary"
                size="md"
                icon="check"
                onPress={() => {}}
                style={{width: '100%'}}
              />
            </View>
          </AppCard>
        </View>

        {/* Right Recent Inward Slips */}
        <View style={styles.rightCol}>
          <AppCard
            title="Today's Weighbridge Slips"
            subtitle={`${SAMPLE_TICKETS.length} consignments cleared`}>
            <AppTable
              columns={columns}
              data={SAMPLE_TICKETS}
              keyExtractor={item => item.id}
            />
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
    flex: 1.6,
  },
  rightCol: {
    flex: 2,
  },
  scaleDisplayContainer: {
    backgroundColor: '#050A14',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: '#183159',
    padding: spacing.lg,
    marginBottom: spacing.xs,
  },
  indicatorStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  greenPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusPillText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  zeroTrackText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  scaleValueBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  scaleNumber: {
    color: '#38BDF8',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  scaleUnit: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  scaleButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  scaleBtn: {
    minWidth: 140,
  },
  formGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formCol: {
    flex: 1,
  },
  ticketActions: {
    marginTop: spacing.md,
  },
});

export default GoodsInwardScreen;
