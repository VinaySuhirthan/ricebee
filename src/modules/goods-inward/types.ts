import {BaseEntity} from '../../shared/types/common';

export type InwardStatus =
  | 'gross-weighed'
  | 'tare-weighed'
  | 'unloading'
  | 'completed'
  | 'rejected';

export interface WeighScaleTicket extends BaseEntity {
  ticketNumber: string;
  vehicleNumber: string;
  driverName: string;
  supplierName: string;
  paddyVariety: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  bagsCount: number;
  moisturePercent: number;
  deductionKg: number;
  finalWeightKg: number;
  status: InwardStatus;
}
