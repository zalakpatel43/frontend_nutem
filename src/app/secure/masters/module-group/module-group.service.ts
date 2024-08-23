import { Injectable } from "@angular/core";
import { CRUDService, BaseService, APIConstant } from "@app-core";
import { List, ModuleGroup } from "@app-models";
import { Observable } from "rxjs";

@Injectable()
export class ModuleGroupService extends CRUDService<ModuleGroup> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "modulegroup");
    }

    getModuleGroupList(): Observable<List[]> {
        return this._baseService.get<List[]>(`${APIConstant.modulegroup}/list`);
    }
}