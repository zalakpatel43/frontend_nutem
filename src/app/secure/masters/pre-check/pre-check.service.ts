import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class PreCheckService {

  constructor(private http: HttpClient, private _baseService: BaseService) {}

  // Pre Check APIs
  getPreCheckList() {
    return this.http.get(`${APIConstant.preCheckList}`);
  }

  addPreCheck(payload: any) {
    return this.http.post(`${APIConstant.preCheckAdd}`, payload);
  }

  updatePreCheck(payload: any) {
    return this.http.post(`${APIConstant.preCheckEdit}`, payload);
  }

  getByIdPreCheck(id: number) {
    return this.http.get(`${APIConstant.preCheckGetById}?id=${id}`);
  }

  deletePreCheck(id: number) {
    return this.http.delete(`${APIConstant.preCheckDelete}?id=${id}`);
  }

  // Production Order API
  getAllProductionOrders() {
    return this.http.get(`${APIConstant.ProductionOrderList}`);
  }

  // Shift API
  getAllShifts() {
    return this.http.get(`${APIConstant.ShiftList}`);
  }

  // Filling Line API
  getAllFillingLines() {
    return this.http.get(`${APIConstant.MasterList}`);
  }

  // Product API
  getAllProducts() {
    return this.http.get(`${APIConstant.ProductList}`);
  }

  // Filler Operator API
  getAllFillerOperators() {
    return this.http.get(`${APIConstant.user}`);
  }

  // PrePostQuestion API
  getAllQuestions() {
    return this.http.get(`${APIConstant.PrePostQuestion}`);
  }
}
