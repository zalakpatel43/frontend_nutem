import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';  // Adjust the import path as necessary
import { List, TermsAndConditions } from '@app-models';  // Adjust the import path as necessary
import { Observable } from 'rxjs';

@Injectable()
export class TermsAndConditionsService extends CRUDService<TermsAndConditions> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "termsAndConditions");
    }

    getTermsAndConditionsList(): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.termsAndConditions}/list`);
    }
}