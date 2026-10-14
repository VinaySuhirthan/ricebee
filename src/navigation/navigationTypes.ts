import React from 'react';
import {IconName} from '../shared/types/common';

export type RouteKey =
  | 'dashboard'
  | 'global-search'
  | 'customers'
  | 'sales-orders'
  | 'invoices-billing'
  | 'payments'
  | 'follow-ups'
  | 'whatsapp-scheduler'
  | 'returns'
  | 'goods-inward'
  | 'products'
  | 'offline'
  | 'online'
  | 'notifications'
  | 'activity-log'
  | 'settings';

export type SectionKey =
  | 'OVERVIEW'
  | 'SALES & CRM'
  | 'WAREHOUSE & SUPPLY CHAIN'
  | 'SYSTEM';

export interface NavItemConfig {
  key: RouteKey;
  label: string;
  icon: IconName;
  badge?: number | string;
  badgeVariant?: 'primary' | 'danger' | 'warning' | 'info';
}

export interface NavSectionConfig {
  key: SectionKey;
  title: string;
  items: NavItemConfig[];
}

export interface NavigationContextType {
  currentRoute: RouteKey;
  params: Record<string, unknown>;
  navigate: (route: RouteKey, params?: Record<string, unknown>) => void;
  goBack: () => void;
  canGoBack: boolean;
}

export interface RouteDefinition {
  key: RouteKey;
  title: string;
  section: SectionKey;
  component: React.ComponentType<any>;
}
