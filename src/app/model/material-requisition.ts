import { BaseAuditable } from './base-auditable';

export class MaterialRequisition extends BaseAuditable {
    id: number;
    materialRequisitionCode: string;
    materialRequisitionDate: Date;
    warehouseId?: number;
    warehouseName: string;
    expectedDate: Date;
    customerId?: number;
    customerName: string;
    shippingAddressId?: number;
    shippingAddress: string;
    billingAddressId?: number;
    billingAddress: string;
    remarks: string;

    materialRequisitionProductDetails: MaterialRequisitionProductDetails[];
}

export class MaterialRequisitionProductDetails extends BaseAuditable {
    id: number;
    materialRequisitionId: number;
    productId: number;
    productName: string;
    productDescription: string;
    quantity: number;
    uomId: number;
    uomName: string;
}