import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { Location, List } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class LocationService extends CRUDService<Location> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'location');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.location}/generateCode`);
    }

    getCompanies(): Observable<any[]> {
        return this._baseService.get<any[]>(`${APIConstant.company}`);
    }

    getStates(): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.state}`);
    }

    getCountries(): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.country}`);
    }
}
