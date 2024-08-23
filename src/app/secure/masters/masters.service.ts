import { Injectable } from "@angular/core";
import { APIConstant, BaseService } from "@app-core";
import { ChangePassword, List } from "@app-models";
import { Observable } from "rxjs";

@Injectable()
export class MasterService
{
    constructor(private baseService : BaseService)
    {

    }
    changePassword(data : ChangePassword):Observable<any>
    {
        return this.baseService.put<any>(`${APIConstant.account}/changepassword`, data);
    }  

   

}
