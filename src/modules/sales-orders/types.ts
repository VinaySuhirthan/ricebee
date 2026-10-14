import {BaseEntity} from '../../shared/types/common';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  productName: string;
  variety: string;
  quantityBags: number;
  weightKg: number;
  ratePerBag: number;
  totalAmount: number;
}

export interface SalesOrderRecord extends BaseEntity {
  orderNumber: string;
  customerName: string;
  customerFirm: string;
  orderDate: string;
  deliveryDate: string;
  totalBags: number;
  totalWeightTons: number;
  grandTotal: string;
  advancePaid: string;
  balanceDue: string;
  status: OrderStatus;
  items: OrderItem[];
}
