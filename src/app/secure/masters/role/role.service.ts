import { Injectable } from "@angular/core";
import { CRUDService, BaseService } from "@app-core";
import { Role } from "@app-models";

@Injectable()
export class RoleService extends CRUDService<Role> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "role");
    }
}