import { Injectable } from "@angular/core";
import { CRUDService, BaseService } from "@app-core";
import { BOMMaster } from "@app-models";

@Injectable()
export class BOMService extends CRUDService<BOMMaster> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "bom");
    }
}
