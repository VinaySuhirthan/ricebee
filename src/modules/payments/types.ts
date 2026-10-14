import {BaseEntity} from '../../shared/types/common';

export type PaymentMethod = 'Bank NEFT/RTGS' | 'UPI' | 'Cash' | 'Cheque';
export type PaymentStatus = 'cleared' | 'pending' | 'bounced';

export interface PaymentRecord extends BaseEntity {
  receiptNumber: string;
  invoiceNumber: string;
  customerFirm: string;
  amount: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  paymentDate: string;
  status: PaymentStatus;
}
