import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class ProductionOrderService {

  constructor(private http: HttpClient, private _baseService: BaseService) {}

  // Production Order APIs
  getProductionOrderList() {
    return this.http.get(`${APIConstant.productionOrderList}`);
  }

  getPOByStatus(status : string) {
    return this.http.get(`${APIConstant.POByStatus}` + "?status=" + status);
  }

  getByIdProductionOrder(id: number) {
    return this.http.get(`${APIConstant.productionOrderGetById}/${id}`);
  }

  toggleProductionOrderStatus(id: number) {
    return this.http.patch(`${APIConstant.productionOrderStatus}/${id}`,null);
  }
}
