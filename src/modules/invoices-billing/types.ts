import {BaseEntity} from '../../shared/types/common';

export type InvoiceStatus =
  | 'paid'
  | 'unpaid'
  | 'partially-paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceRecord extends BaseEntity {
  invoiceNumber: string;
  orderNumber?: string;
  customerFirm: string;
  customerGstin: string;
  issueDate: string;
  dueDate: string;
  subtotal: string;
  taxAmount: string;
  grandTotal: string;
  paidAmount: string;
  dueAmount: string;
  status: InvoiceStatus;
  ewayBillNumber?: string;
}
