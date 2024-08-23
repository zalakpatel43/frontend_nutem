import { Injectable } from "@angular/core";
import { CRUDService, BaseService, APIConstant } from "@app-core";
import { Customer } from "@app-models";

@Injectable()
export class CustomerService extends CRUDService<Customer> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "customer");
    }

    generateCustomerCode() {
        return this._baseService.get<string>(`${APIConstant.customer}/GenerateCode`);
    }

  

    getUsers() {
        return this._baseService.get<any[]>(`${APIConstant.account}`);
    }
}
