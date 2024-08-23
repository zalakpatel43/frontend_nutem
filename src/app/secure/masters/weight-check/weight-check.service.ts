import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDService, BaseService, APIConstant } from "@app-core";

@Injectable({
  providedIn: 'root'
})
export class WeightCheckService {

  constructor(private http:HttpClient,
    private _baseService: BaseService) { }

    getWeightCheckList() {
      return this.http.get(`${APIConstant.weightcheckList}`);
      //this._baseService.get<string>(`${APIConstant.weightcheckList}`);
    }

    getNozzleList() {
      return this.http.get(`${APIConstant.NozzleList}`);
    }

    getShiftList() {
      return this.http.get(`${APIConstant.ShiftList}`);
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

    addWeightCheck(playload){
      return this.http.post(`${APIConstant.weightcheckAdd}`,playload);
    }
}
