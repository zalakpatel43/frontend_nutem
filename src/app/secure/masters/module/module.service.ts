import { Injectable } from "@angular/core";
import { CRUDService, BaseService } from "@app-core";
import { Module } from "@app-models";

@Injectable()
export class ModuleService extends CRUDService<Module> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "module");
    }
}
