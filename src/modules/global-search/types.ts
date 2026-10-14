import {IconName, BadgeVariant} from '../../shared/types/common';

export type SearchCategory =
  | 'all'
  | 'customers'
  | 'orders'
  | 'invoices'
  | 'products'
  | 'scale';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  meta: string;
  badge: string;
  badgeVariant: BadgeVariant;
  icon: IconName;
  targetRoute: string;
}
