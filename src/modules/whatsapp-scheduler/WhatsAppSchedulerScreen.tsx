import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ScheduledCampaign} from './types';
import PageHeader from '../../shared/components/PageHeader';
import AppCard from '../../shared/components/AppCard';
import AppTable from '../../shared/components/AppTable';
import AppBadge from '../../shared/components/AppBadge';
import AppButton from '../../shared/components/AppButton';
import AppInput from '../../shared/components/AppInput';
import {TableColumn} from '../../shared/types/common';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {spacing} from '../../shared/theme/spacing';

const SAMPLE_CAMPAIGNS: ScheduledCampaign[] = [
  {
    id: 'camp-1',
    campaignName: 'Daily Grain Mill Rate Card',
    templateType: 'Daily Rate Card',
    targetAudience: 'All Wholesale Buyers (Nagpur & Vidarbha)',
    recipientCount: 420,
    scheduledTime: 'Today, 04:00 PM',
    status: 'scheduled',
    messagePreview:
      "🌾 Today's Mill Gate Rates: Sonam Steamed ₹1850/bag, HMT Kolam ₹1600/bag. Orders open till 6 PM.",
    createdAt: '2026-10-14T08:00:00',
  },
  {
    id: 'camp-2',
    campaignName: 'Payment Balance Overdue Follow-up',
    templateType: 'Payment Reminder',
    targetAudience: 'Debtors > 15 Days Past Due',
    recipientCount: 18,
    scheduledTime: 'Today, 05:30 PM',
    status: 'scheduled',
    messagePreview:
      'Dear Partner, your balance of ₹{{amount}} is overdue. Please settle via NEFT to avoid credit hold.',
    createdAt: '2026-10-14T09:15:00',
  },
  {
    id: 'camp-3',
    campaignName: 'Morning Dispatch Confirmations',
    templateType: 'Dispatch Alert',
    targetAudience: 'Today Dispatched Orders',
    recipientCount: 12,
    scheduledTime: 'Today, 10:30 AM',
    status: 'sent',
    messagePreview:
      'Your order {{order_no}} has departed mill gate with vehicle {{truck_no}}. E-Way bill attached.',
    createdAt: '2026-10-14T05:00:00',
  },
];

export const WhatsAppSchedulerScreen: React.FC = () => {
  const [campaigns, setCampaigns] =
    useState<ScheduledCampaign[]>(SAMPLE_CAMPAIGNS);
  const [campaignName, setCampaignName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSchedule = () => {
    if (!campaignName) {
      return;
    }
    const newCamp: ScheduledCampaign = {
      id: `camp-${Date.now()}`,
      campaignName,
      templateType: 'Daily Rate Card',
      targetAudience: targetAudience || 'All Trade Partners',
      recipientCount: 50,
      scheduledTime: 'Today, 06:00 PM',
      status: 'scheduled',
      messagePreview: messageText || 'Sample broadcast message',
      createdAt: new Date().toISOString(),
    };
    setCampaigns(prev => [newCamp, ...prev]);
    setCampaignName('');
    setTargetAudience('');
    setMessageText('');
  };

  const columns: TableColumn<ScheduledCampaign>[] = [
    {
      key: 'campaignName',
      title: 'CAMPAIGN / TEMPLATE',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.bodyBold, {color: colors.textPrimary}]}>
            {item.campaignName}
          </Text>
          <Text style={[typography.caption, {color: colors.primary}]}>
            {item.templateType}
          </Text>
        </View>
      ),
    },
    {
      key: 'targetAudience',
      title: 'AUDIENCE & RECIPIENTS',
      width: 220,
      render: item => (
        <View>
          <Text style={[typography.body, {color: colors.textSecondary}]}>
            {item.targetAudience}
          </Text>
          <Text style={[typography.caption, {color: colors.textMuted}]}>
            {item.recipientCount} verified WhatsApp contacts
          </Text>
        </View>
      ),
    },
    {
      key: 'scheduledTime',
      title: 'SCHEDULED TIME',
      width: 150,
      render: item => (
        <Text style={[typography.body, {color: colors.textPrimary}]}>
          {item.scheduledTime}
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
          item.status === 'sent'
            ? 'success'
            : item.status === 'scheduled'
            ? 'info'
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
        title="WhatsApp Campaign Scheduler"
        description="Automated payment reminders, broadcast daily mill grain rates, and instant dispatch notifications via WhatsApp Cloud API."
        breadcrumb={['RICEBEE', 'Sales & CRM', 'WhatsApp Scheduler']}
        actions={
          <View style={styles.headerActions}>
            <AppButton
              title="API Gateway: Connected"
              variant="secondary"
              size="sm"
              icon="check"
              onPress={() => {}}
            />
          </View>
        }
      />

      <View style={styles.layoutRow}>
        {/* Left Schedule Form */}
        <View style={styles.leftCol}>
          <AppCard
            title="Schedule New Broadcast"
            subtitle="Broadcast rates, reminders, or festive greetings">
            <AppInput
              label="Campaign Title"
              value={campaignName}
              onChangeText={setCampaignName}
              placeholder="e.g. Diwali Premium Basmati Pre-booking"
              icon="whatsapp"
            />
            <AppInput
              label="Target Audience Group"
              value={targetAudience}
              onChangeText={setTargetAudience}
              placeholder="e.g. All Maharashtra Wholesalers"
              icon="customers"
            />
            <AppInput
              label="Message Template Body"
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type message content with variables like {{firm_name}}, {{amount}}..."
              multiline={true}
            />

            <View style={styles.formActions}>
              <AppButton
                title="Schedule Broadcast"
                variant="primary"
                size="md"
                icon="clock"
                onPress={handleSchedule}
              />
              <AppButton
                title="Send Test to My Phone"
                variant="ghost"
                size="md"
                onPress={() => {}}
              />
            </View>
          </AppCard>
        </View>

        {/* Right Scheduled Queue */}
        <View style={styles.rightCol}>
          <AppCard
            title="Scheduled & Recent Queues"
            subtitle={`${campaigns.length} campaigns in queue`}>
            <AppTable
              columns={columns}
              data={campaigns}
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
    flex: 1.5,
  },
  rightCol: {
    flex: 2.2,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});

export default WhatsAppSchedulerScreen;
