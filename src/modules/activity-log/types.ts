import {BaseEntity} from '../../shared/types/common';

export type AuditCategory =
  | 'SECURITY'
  | 'BILLING'
  | 'WEIGHBRIDGE'
  | 'INVENTORY'
  | 'SYSTEM';

export interface ActivityLogEntry extends BaseEntity {
  user: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  device: string;
  category: AuditCategory;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}
