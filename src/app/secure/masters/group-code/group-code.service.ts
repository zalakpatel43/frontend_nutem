import { Injectable } from "@angular/core";
import { CRUDService, BaseService, APIConstant } from "@app-core";
import { GroupCode } from "@app-models";

@Injectable()
export class GroupCodeService extends CRUDService<GroupCode> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "groupcode");
    }

    generateCode() {
        return this._baseService.get<string>(`${APIConstant.groupcode}/generateCode`);
    }
}
