export type OnlineOrderStatus =
  | 'new_order'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type OrderSource = 'WhatsApp' | 'Web Portal' | 'B2B App' | 'Broker API';

export interface OnlineOrder {
  id: string;
  orderNumber: string;
  source: OrderSource;
  customerName: string;
  phone: string;
  location: string;
  itemsSummary: string;
  totalBags: number;
  totalAmount: number;
  paymentStatus: 'Paid (UPI)' | 'Pending' | 'Advance Received';
  status: OnlineOrderStatus;
  timestamp: string;
}

export interface CloudSyncInfo {
  serverStatus: 'online' | 'syncing' | 'offline';
  lastSyncedAt: string;
  unsyncedRecords: number;
  remoteUpdatesAvailable: number;
}
