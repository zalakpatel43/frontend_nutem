import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { QualityParameter } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class QualityParameterService extends CRUDService<QualityParameter> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'qualityParameter');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.qualityParameter}/generateCode`);
    }

}
