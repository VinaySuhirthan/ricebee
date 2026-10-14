import {BadgeVariant, IconName} from '../../shared/types/common';

export interface DashboardKpi {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: IconName;
  badgeText: string;
  badgeVariant: BadgeVariant;
}

export interface RecentOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: string;
  status: 'completed' | 'pending' | 'processing';
  itemsCount: number;
}

export interface ActivitySummaryItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'sale' | 'inward' | 'payment' | 'alert';
}
