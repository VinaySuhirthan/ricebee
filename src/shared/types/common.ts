import {ReactNode} from 'react';

export type StatusType =
  | 'active'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'draft'
  | 'overdue';

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface TableColumn<T> {
  key: string;
  title: string;
  width?: number | `${number}%` | 'auto';
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => ReactNode;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export type IconName =
  | 'dashboard'
  | 'search'
  | 'customers'
  | 'orders'
  | 'billing'
  | 'invoices'
  | 'payments'
  | 'followups'
  | 'whatsapp'
  | 'returns'
  | 'scale'
  | 'products'
  | 'notifications'
  | 'activity'
  | 'plus'
  | 'filter'
  | 'refresh'
  | 'download'
  | 'settings'
  | 'user'
  | 'calendar'
  | 'check'
  | 'close'
  | 'arrow-right'
  | 'arrow-left'
  | 'trending-up'
  | 'trending-down'
  | 'clock'
  | 'currency';
