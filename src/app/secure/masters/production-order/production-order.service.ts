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

  getByIdProductionOrder(id: number) {
    return this.http.get(`${APIConstant.productionOrderGetById}/${id}`);
  }

//   deleteProductionOrder(id: number) {
//     return this.http.delete(`${APIConstant.productionOrderDelete}?id=${id}`);
//   }
}