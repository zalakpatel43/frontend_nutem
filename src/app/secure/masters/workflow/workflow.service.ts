import { Injectable } from "@angular/core";
import { CRUDService, BaseService, APIConstant } from "@app-core";
import { Workflow } from "@app-models";

@Injectable()
export class WorkflowService extends CRUDService<Workflow> {
    constructor(private _baseService: BaseService) {
        super(_baseService, "workflow");
    }

    generateWorkflowCode() {
        return this._baseService.get<string>(`${APIConstant.workflow}/GenerateCode`);
    }

    getUsers() {
        return this._baseService.get<any[]>(`${APIConstant.account}`);
    }
}
