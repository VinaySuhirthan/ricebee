import {BaseEntity} from '../../shared/types/common';

export type FollowUpPriority = 'high' | 'medium' | 'low';
export type FollowUpType = 'payment' | 'order-reorder' | 'quote' | 'dispatch';

export interface FollowUpRecord extends BaseEntity {
  customerFirm: string;
  contactPerson: string;
  phone: string;
  type: FollowUpType;
  priority: FollowUpPriority;
  dueDate: string;
  notes: string;
  amountExpected?: string;
  isCompleted: boolean;
}
