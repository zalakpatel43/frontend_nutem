import { FileUploaderService } from '../core/service';
import { BaseAuditable } from './base-auditable';
import { DocumentDetails } from './document-details';

export class SalesOrder extends BaseAuditable {
    id: number;
    salesOrderCode: string;
    revisionNo: string;
    salesPersonId: number;
    customerId: number;
    customerDetailId: number;
    taxRegistrationNumber?: string;
    companyId?: number;
    opportunityId?: number;
    customerPONumber: string;
    date: Date;
    salesOrderTypeId: number;
    currencyId: number;
    termsCondition?: string;
    totalProductAmount?: number;
    discountTypeId?: number;
    discountTypeAmount?: number;
    discountAmount?: number;
    subTotal?: number;
    totalTaxAmount?: number;
    totalAmount?: number;

    salesOrderProductDetails: SalesOrderProductDetails[] = [];
    salesOrderAttachments: SalesOrderAttachments[] = [];
}

export class SalesOrderProductDetails extends BaseAuditable {
    id: number;
    salesOrderId: number;
    productId: number;
    qty: number;
    uomId: number;
    uomName: string;
    amount: number;
    discountTypeId?: number;
    discountTypeAmount?: number;
    discountAmount?: number;
    subTotal: number;
    taxTypeAmount: number;
    expectedDeliveryDate?: Date;
}

export class SalesOrderAttachments extends BaseAuditable {
    id?: number;
    salesOrderId?: number;
    documentName: string;
    pictureId?: number;
    picture: DocumentDetails;
    uploader: FileUploaderService;
    hideUploader: boolean;
    uniqueId: string
}
