import { Injectable } from "@angular/core";
import { APIConstant, BaseService, CRUDService } from "@app-core";
import { List, User } from "@app-models";
import { Observable } from "rxjs";

@Injectable()
export class UserService extends CRUDService<User>{

    constructor(private _baseService: BaseService) {
        super(_baseService, "user");
    }

    getReportsToUsers(townId: number, excludeUserId: number): Observable<List[]> {
        return this._baseService.get(`${APIConstant.account}/gettownusers/${townId}/${excludeUserId}`);
    }
     // Method to get paginated user data
     getUsers(pageIndex: number, pageSize: number): Observable<any> {
        return this._baseService.get(`${APIConstant.user}/paged?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    }
}