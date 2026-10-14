export interface BillingItem {
  id: string;
  productName: string;
  hsnCode: string;
  quantityBags: number;
  weightKg: number;
  ratePerUnit: number;
  taxPercent: number;
  total: number;
}

export interface BillingFormData {
  customerName: string;
  phone: string;
  gstin: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Credit';
  discountAmount: number;
  notes: string;
}
