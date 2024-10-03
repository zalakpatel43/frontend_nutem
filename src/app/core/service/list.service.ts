import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IListService } from "../interface";
import { BaseService } from "./base.service";
import { GroupCode, List, PermissionModule, State } from "@app-models";
import { APIConstant } from "../constant";

@Injectable()
export class ListService implements IListService {

    constructor(private baseService: BaseService) {

    }

    getList(listName: string): Observable<List[]> {
      //  console.log("listname ", listName)
        return this.baseService.get(`${APIConstant.list[listName]}`);
    }

    getAllStates(): Observable<State[]> {
        return this.baseService.get(`${APIConstant.state}`);
    }

    getCountries(): Observable<List[]> {
        return this.baseService.get<List[]>(`${APIConstant.country}/GetActiveCountries`);
    }

    getModulePermissionList(): Observable<PermissionModule[]> {
        return this.baseService.get<PermissionModule[]>(`${APIConstant.list.modulePermission}`);
    }

    // getTypes(): Observable<GroupCode[]> {
    //     return this.baseService.get<GroupCode[]>(`${APIConstant.list.types}`);
    // }

    // getCategories(): Observable<GroupCode[]> {
    //     return this.baseService.get<GroupCode[]>(`${APIConstant.list.categories}`);
    // }
}