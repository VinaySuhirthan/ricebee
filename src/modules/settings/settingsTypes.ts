export interface AppSettings {
  // Tax / GST Configuration
  enableTax: boolean;
  cgstPercent: number;
  sgstPercent: number;
  hsnCode: string;

  // Mill / Store Branding
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  gstin: string;

  // Billing Preferences
  defaultPaymentMode: 'Cash' | 'UPI' | 'Due';
  enableRoundOff: boolean;
  invoiceFooterNote: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  enableTax: true,
  cgstPercent: 2.5,
  sgstPercent: 2.5,
  hsnCode: '1006',
  companyName: 'RICEBEE ENTERPRISES',
  tagline: 'Wholesale Rice Mill & Retail Counter',
  address: '1, 25, Naidu St, Kurinji Nagar, Ramapuram, Chennai - 600089',
  phone: '090926 80809',
  gstin: '33KMDPK6488K1ZD',
  defaultPaymentMode: 'Cash',
  enableRoundOff: true,
  invoiceFooterNote: 'Thank you for your business! Rice once sold cannot be returned without original receipt.',
};
