import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { InwardProductDetails, List, PurchaseOrder } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseOrderService extends CRUDService<PurchaseOrder> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'purchaseOrder');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.purchaseOrder}/GenerateCode`);
    }

    getVendorAddresses(vendorId: number): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.vendormaster}/vendorAddresses/${vendorId}`);
    }

    getVendorContacts(vendorId: number): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.vendormaster}/vendorContacts/${vendorId}`);
    }

    getProductUOMs(productId: number): Observable<List> {
        return this._baseService.get<List>(`${APIConstant.product}/productUOMs/${productId}`);
    }

    getPendingPurchaseOrdersByVendorId(VendorId: number): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.purchaseOrder}/PendingPurchaseOrdersByVendorId/${VendorId}`);
    }

    getPendingProductDetailsByPurchaseOrderId(purchaseOrderId: number): Observable<InwardProductDetails[]> {
        return this._baseService.get<InwardProductDetails[]>(`${APIConstant.purchaseOrder}/PendingProductDetailsByPurchaseOrderId/${purchaseOrderId}`);
    }
}