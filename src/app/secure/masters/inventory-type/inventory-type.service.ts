import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { InventoryType, List } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class InventoryTypeService extends CRUDService<InventoryType> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'inventorytype');
    }

    generateInventoryTypeCode() {
        return this._baseService.get<string>(`${APIConstant.inventorytype}/GenerateCode`);
    }

    getInwardInventoryTypes(): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.inventorytype}/Inward`);
    }

    getOutwardInventoryTypes(): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.inventorytype}/Outward`);
    }
}