import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from '@app-core';
import { List, SalesOrder } from '@app-models';
import { Observable } from 'rxjs';

@Injectable()
export class SalesOrderService extends CRUDService<SalesOrder> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'salesOrder');
    }

    generateCode(): Observable<string> {
        return this._baseService.get<string>(`${APIConstant.salesOrder}/generateCode`);
    }

    getCustomerDetails(customerId: number): Observable<any[]> {
        return this._baseService.get<any[]>(`${APIConstant.customer}/customerDetails/${customerId}`);
    }

    getProductUOMs(productId: number): Observable<List> {
        return this._baseService.get<List>(`${APIConstant.product}/productUOMs/${productId}`);
    }

    getUsers() {
        return this._baseService.get<any[]>(`${APIConstant.account}`);
    }
}
