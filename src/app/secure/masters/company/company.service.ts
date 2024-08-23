import { Injectable } from "@angular/core";
import { APIConstant, BaseService, CRUDService } from "@app-core";
import { List, Company } from "@app-models";
import { Observable } from "rxjs";

@Injectable()
export class CompanyService extends CRUDService<Company>{

    constructor(private _baseService: BaseService) {
        super(_baseService, "company");
    }

    
}
