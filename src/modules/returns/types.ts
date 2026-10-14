import {BaseEntity} from '../../shared/types/common';

export type ReturnStatus =
  | 'approved'
  | 'inspecting'
  | 'rejected'
  | 'credit-issued';

export interface ReturnRecord extends BaseEntity {
  returnNumber: string;
  orderNumber: string;
  customerFirm: string;
  commodity: string;
  bagsReturned: number;
  reason:
    | 'Quality / Broken Grains'
    | 'Moisture High'
    | 'Packaging Torn'
    | 'Excess Dispatch';
  creditNoteAmount: string;
  status: ReturnStatus;
}
