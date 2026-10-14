export type OrderType = 'offline' | 'online';
export type PaymentMode = 'Cash' | 'UPI' | 'Credit' | 'Due';
export type StorePaymentStatus = 'Paid' | 'Pending' | 'Partial';
export type SyncStatus = 'synced' | 'pending_sync' | 'offline_saved';

export interface StockItem {
  id: string;
  riceName: string;
  quantity: number;     // in kg
  pricePerKg: number;   // rate in ₹/kg
  brand?: string;       // optional brand (e.g. Annam, Organic Tattva, Double Horse)
}

export interface BillItem {
  id: string;
  variety: string;      // 1. Rice Variety
  brand?: string;       // Optional Brand
  qtyKg: number;        // 2. Qty (kg)
  ratePerKg: number;    // 3. Rate/kg
  amount: number;       // 4. Amount
}

export interface StoreOrder {
  id: string;
  orderNo: string;
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  totalQtyKg: number;
  subtotal: number;
  discount: number;
  taxableAmount?: number;
  cgstPercent?: number;
  cgstAmount?: number;
  sgstPercent?: number;
  sgstAmount?: number;
  totalTax?: number;
  roundOff?: number;
  hsnCode?: string;
  grandTotal: number;
  paymentMode: PaymentMode;
  paymentStatus: StorePaymentStatus;
  syncStatus: SyncStatus;
  notes?: string;
  createdAt: string;
}

export interface BillingSummary {
  todayBillsCount: number;
  todayQtySoldKg: number;
  todayRevenue: number;
  pendingSyncCount: number;
}
