import { BaseAuditable } from './base-auditable';

export class PurchaseOrder extends BaseAuditable {
    id: number;
    purchaseOrderCode: string;
    revisionNo: string;
    vendorId: number;
    vendorName:string;
    vendorAddressId: number;
    vendorAddress: string;
    vendorContactId: number;
    vendorContact: string;
    poDate: Date;
    totalProductAmount?: number;
    discountTypeId?: number;
    discountType: string;
    discountTypeAmount?: number;
    discountAmount?: number;
    subTotal?: number;
    totalTaxAmount?: number;
    totalAmount?: number;
    approvalStatusId: number;
    approvalStatus:string;
    purchaseOrderProductDetails: PurchaseOrderProductDetails[] = [];
    purchaseOrderTermsDetails: PurchaseOrderTermsDetails[] = [];
}

export class PurchaseOrderProductDetails extends BaseAuditable {
    id: number;
    purchaseOrderId: number;
    drawingNumber: string;
    productId: number;
    productName: string;
    qty: number;
    uomId: number;
    uomName: string;
    amount: number;
    discountTypeId?: number;
    discountType: string;
    discountTypeAmount?: number;
    discountAmount?: number;
    subTotal: number;
    taxTypeAmount: number;
    deliveryDate?: Date;
}

export class PurchaseOrderTermsDetails extends BaseAuditable {
    id: number;
    purchaseOrderId: number;
    termsConditionId: number;
    termsCondition :string;
}
