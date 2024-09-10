import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from "@app-core";

@Injectable({
  providedIn: 'root'
})
export class TrailerLoadingService {

  constructor(private http: HttpClient, private _baseService: BaseService) { }

  getTrailerLoadingList() {
    return this.http.get(`${APIConstant.trailerLoadingList}`);
  }
  getProductionOrderList() {
    return this.http.get(`${APIConstant.ProductionOrderList}`);
  }
  getProductList() {
    return this.http.get(`${APIConstant.ProductList}`);
  }

  getUserList() {
    return this.http.get(`${APIConstant.UserList}`);
  }

  addTrailerLoading(payload: any) {
    return this.http.post(`${APIConstant.trailerLoadingAdd}`, payload);
  }

  updateTrailerLoading(payload: any) {
    return this.http.post(`${APIConstant.trailerLoadingEdit}`, payload);
  }

  getByIdTrailerLoading(id: number) {
    return this.http.get(`${APIConstant.trailerLoadingGetById}` + "?id=" + id);
  }

  deleteTrailerLoading(id: number) {
    return this.http.get(`${APIConstant.trailerLoadingDelete}` + "?id=" + id);
  }
}
