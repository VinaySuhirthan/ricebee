import {BaseEntity} from '../../shared/types/common';

export type MessageScheduleStatus = 'scheduled' | 'sent' | 'failed' | 'draft';

export interface ScheduledCampaign extends BaseEntity {
  campaignName: string;
  templateType:
    | 'Payment Reminder'
    | 'Daily Rate Card'
    | 'Order Confirmation'
    | 'Dispatch Alert';
  targetAudience: string;
  recipientCount: number;
  scheduledTime: string;
  status: MessageScheduleStatus;
  messagePreview: string;
}
