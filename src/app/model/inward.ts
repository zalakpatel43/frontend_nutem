import { BaseAuditable } from "./base-auditable";
import { DocumentDetails } from "./document-details";

export class Inward extends BaseAuditable {
    id: number;
    inwardCode: string;
    inwardDate: Date;
    inventoryTypeId: number;
    inventoryTypeName: string;
    fromWarehouseId: number;
    fromWarehouseName: string;
    customerId: number | null;
    customerName: string;
    vendorId: number | null;
    vendorName: string;
    warehouseId: number | null;
    warehouseName: string;
    purchaseOrderId: number | null;
    purchaseOrderCode: string;
    supportingDocumentNo: string | null;
    supportingDocumentDate: Date | null;
    supportingDocumentId: bigint | null;
    supportingDocument: DocumentDetails;
    remarks: string | null;

    inwardProductDetails: InwardProductDetails[];
}

export class InwardProductDetails extends BaseAuditable {
    id: number;
    inwardId: number;
    productId: number;
    productName: string;
    productDescription: string;
    quantity: number;
    uomId: number;
    uomName: string;
    remarks: string | null;
    poQuantity: number;
    pastReceivedQuantity: number;
    remainingQuantity: number;
}