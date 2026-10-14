import {BaseEntity} from '../../shared/types/common';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ProductRecord extends BaseEntity {
  sku: string;
  name: string;
  category:
    | 'Raw Basmati'
    | 'Steamed Rice'
    | 'Kolam / Parboiled'
    | 'Broken / Bran';
  bagWeightKg: number;
  stockBags: number;
  reorderLevelBags: number;
  millGatePrice: string;
  mrp: string;
  warehouseLocation: string;
  status: StockStatus;
}
