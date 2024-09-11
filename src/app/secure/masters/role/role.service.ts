import { Injectable } from "@angular/core";
import { CRUDService, BaseService } from "@app-core";
import { Role } from "@app-models";
import { APIConstant} from '@app-core';
import { HttpClient } from '@angular/common/http';
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

    getRole() {
        return this.http.get(`${APIConstant.permissionList}`);
    }
    updateRole(roleId: number, payload: any) {
        return this.http.post(`${APIConstant.permissionEdit}`, payload);
    }
    addRole(payload: any) {
        return this.http.post(`${APIConstant.permissionAdd}`, payload);
    }
    getRoleById(id: number) {
        return this.http.get(`${APIConstant.permissionGetById}?id=${id}`);
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
        return this.http.delete(`${APIConstant.permissionDelete}?id=${id}`);
      }
}