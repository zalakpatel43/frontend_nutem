import { Injectable } from "@angular/core";
import { CRUDService, BaseService } from "@app-core";
import { Role } from "@app-models";
import { APIConstant} from '@app-core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
  })
export class RoleService {
    get() {
        throw new Error('Method not implemented.');
    }
    toggleActivate(id: number, isActive: boolean) {
        throw new Error('Method not implemented.');
    }
   
    constructor(private http: HttpClient,
        private _baseService: BaseService) { }

    getRole():Observable<Role[]> {
        return this.http.get<Role[]>(`${APIConstant.permissionList}`);
    }
    getPermission(permissionId: number) {
        return this.http.get(`${APIConstant.permission}`);
    }
    updateRole(roleId: number, payload: any) {
        return this.http.post(`${APIConstant.permissionEdit}`, payload);
    }
    addRole(payload: any) {
        return this.http.post(`${APIConstant.permissionAdd}`, payload);
    }
    getRoleById(id: number) {
        return this.http.get(`${APIConstant.permissionGetById}/${id}`);
    }
    // getPermissionList() {
    //     throw new Error('Method not implemented.');
    // }
    getByIdRole(roleId: number) {
        throw new Error('Method not implemented.');
    }
    // constructor(private _baseService: BaseService) {
    //     super(_baseService, "role");
    // }
    deleteRole(id: number) {
        return this.http.delete(`${APIConstant.permissionDelete}/${id}`);
      }
}