import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient,
              private _baseService: BaseService) { }

  getPermissionList() {
    return this.http.get(`${APIConstant.permissionList}`);
  }

  addPermission(payload: any) {
    return this.http.post(`${APIConstant.permissionAdd}`, payload);
  }

  updatePermission(payload: any) {
    return this.http.post(`${APIConstant.permissionEdit}`, payload);
  }

  getPermissionById(id: number) {
    return this.http.get(`${APIConstant.permissionGetById}?id=${id}`);
  }

  deletePermission(id: number) {
    return this.http.delete(`${APIConstant.permissionDelete}?id=${id}`);
  }
}
