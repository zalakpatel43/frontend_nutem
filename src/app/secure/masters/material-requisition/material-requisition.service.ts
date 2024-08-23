import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { MaterialRequisition, List } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class MaterialRequisitionService extends CRUDService<MaterialRequisition> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'materialRequisition');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.materialRequisition}/generateCode`);
    }

    getProductUOMs(productId: number): Observable<List> {
        return this._baseService.get<List>(`${APIConstant.product}/productUOMs/${productId}`);
    }
}
