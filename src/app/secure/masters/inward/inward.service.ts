import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { Inward, List } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class InwardService extends CRUDService<Inward> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'inward');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.inward}/generateCode`);
    }

    getVendors(): Observable<any[]> {
        return this._baseService.get<any[]>(`${APIConstant.vendormaster}`);
    }

    getProductUOMs(productId: number): Observable<List> {
        return this._baseService.get<List>(`${APIConstant.product}/productUOMs/${productId}`);
    }
}
