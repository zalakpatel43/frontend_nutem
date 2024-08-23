import { Injectable } from "@angular/core";
import { CRUDService, BaseService, APIConstant } from "@app-core";
import { Product } from "@app-models";
import { Observable } from 'rxjs';

@Injectable()
export class ProductService extends CRUDService<Product> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "product");
    }

    generateCode(): Observable<string> {
        return this._baseService.get(`${APIConstant.product}/generatecode`);
    }
}
