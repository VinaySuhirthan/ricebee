import {RouteKey, RouteDefinition} from '../navigation/navigationTypes';
import {
  DashboardScreen,
  GlobalSearchScreen,
  CustomersScreen,
  SalesOrdersScreen,
  ManualBillingScreen,
  InvoicesBillingScreen,
  PaymentsScreen,
  FollowUpsScreen,
  WhatsAppSchedulerScreen,
  ReturnsScreen,
  GoodsInwardScreen,
  ProductsScreen,
  NotificationsScreen,
  ActivityLogScreen,
} from '../modules';

export const ROUTE_REGISTRY: Record<RouteKey, RouteDefinition> = {
  dashboard: {
    key: 'dashboard',
    title: 'Dashboard',
    section: 'OVERVIEW',
    component: DashboardScreen,
  },
  'global-search': {
    key: 'global-search',
    title: 'Global Search',
    section: 'OVERVIEW',
    component: GlobalSearchScreen,
  },
  customers: {
    key: 'customers',
    title: 'Customers',
    section: 'SALES & CRM',
    component: CustomersScreen,
  },
  'sales-orders': {
    key: 'sales-orders',
    title: 'Sales Orders',
    section: 'SALES & CRM',
    component: SalesOrdersScreen,
  },
  'manual-billing': {
    key: 'manual-billing',
    title: 'Manual Billing',
    section: 'SALES & CRM',
    component: ManualBillingScreen,
  },
  'invoices-billing': {
    key: 'invoices-billing',
    title: 'Invoices & Billing',
    section: 'SALES & CRM',
    component: InvoicesBillingScreen,
  },
  payments: {
    key: 'payments',
    title: 'Payments',
    section: 'SALES & CRM',
    component: PaymentsScreen,
  },
  'follow-ups': {
    key: 'follow-ups',
    title: 'Follow-ups',
    section: 'SALES & CRM',
    component: FollowUpsScreen,
  },
  'whatsapp-scheduler': {
    key: 'whatsapp-scheduler',
    title: 'WhatsApp Scheduler',
    section: 'SALES & CRM',
    component: WhatsAppSchedulerScreen,
  },
  returns: {
    key: 'returns',
    title: 'Returns',
    section: 'SALES & CRM',
    component: ReturnsScreen,
  },
  'goods-inward': {
    key: 'goods-inward',
    title: 'POS — Goods Inward Scale',
    section: 'WAREHOUSE & SUPPLY CHAIN',
    component: GoodsInwardScreen,
  },
  products: {
    key: 'products',
    title: 'Products',
    section: 'WAREHOUSE & SUPPLY CHAIN',
    component: ProductsScreen,
  },
  notifications: {
    key: 'notifications',
    title: 'Notifications',
    section: 'SYSTEM',
    component: NotificationsScreen,
  },
  'activity-log': {
    key: 'activity-log',
    title: 'Activity Log',
    section: 'SYSTEM',
    component: ActivityLogScreen,
  },
};

export const DEFAULT_ROUTE: RouteKey = 'dashboard';
