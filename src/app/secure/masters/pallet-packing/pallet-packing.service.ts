import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService, APIConstant } from "@app-core";

@Injectable({
  providedIn: 'root'
})
export class PalletPackingService {
  getPalletList() {
      throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient,
              private _baseService: BaseService) { }

  getPalletPackingList() {
    return this.http.get(`${APIConstant.palletPackingList}`);
    // Alternatively, you can use the BaseService if needed
    // return this._baseService.get<string>(`${APIConstant.palletPackingList}`);
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

  addPalletPacking(payload: any) {
    return this.http.post(`${APIConstant.palletPackingAdd}`, payload);
  }

 
  updatePalletPacking(playload){
    return this.http.post(`${APIConstant.palletPackingEdit}`,playload);
  }


  getByIdPalletPacking(id: number) {
    return this.http.get(`${APIConstant.palletPackingGetById}?id=${id}`);
  }

  deletePalletPacking(id: number) {
    return this.http.get(`${APIConstant.palletPackingDelete}?id=${id}`);
  }
}
