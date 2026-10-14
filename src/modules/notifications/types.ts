import {BaseEntity, BadgeVariant, IconName} from '../../shared/types/common';

export type NotificationType =
  | 'alert'
  | 'system'
  | 'order'
  | 'weighbridge'
  | 'payment';

export interface NotificationItem extends BaseEntity {
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  isRead: boolean;
  actionRoute?: string;
  badgeText: string;
  badgeVariant: BadgeVariant;
  icon: IconName;
}
