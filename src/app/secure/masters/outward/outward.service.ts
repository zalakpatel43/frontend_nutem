import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { Outward, List } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class OutwardService extends CRUDService<Outward> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'outward');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.outward}/generateCode`);
    }

    getVendors(): Observable<any[]> {
        return this._baseService.get<any[]>(`${APIConstant.vendormaster}`);
    }

    getProductUOMs(productId: number): Observable<List> {
        return this._baseService.get<List>(`${APIConstant.product}/productUOMs/${productId}`);
    }

    getPendingMaterialRequisitionsByCustomerId(customerId: number): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.outward}/PendingMaterialRequisitionsByCustomerId/${customerId}`);
    }
}