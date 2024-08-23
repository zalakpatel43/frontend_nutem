import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { VendorMaster } from '@app-models';

@Injectable()
export class VendorMasterService extends CRUDService<VendorMaster> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'vendormaster');
    }

    generateVendorCode() {
        return this._baseService.get<string>(`${APIConstant.vendormaster}/GenerateCode`);
    }
}