import { BaseAuditable } from './base-auditable';

export class BOMMaster extends BaseAuditable {
  id: number;
  bomCode: string;
  bomName: string;
  finishedProduct: string;
  baseQty: number;
  remarks?: string;
  details: BOMDetails[];
}

export class BOMDetails extends BaseAuditable {
  id: number;
  bomId: number;
  rawProductCode: string;
  componentCode: string;
  qty: number;
  uom: string;
}

