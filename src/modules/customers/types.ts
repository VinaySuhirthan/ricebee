import {BaseEntity} from '../../shared/types/common';

export interface CustomerRecord extends BaseEntity {
  name: string;
  firmName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  gstin: string;
  creditLimit: string;
  outstandingBalance: string;
  status: 'active' | 'suspended' | 'verified';
  category: 'Wholesale' | 'Retailer' | 'Distributor' | 'Broker';
}
