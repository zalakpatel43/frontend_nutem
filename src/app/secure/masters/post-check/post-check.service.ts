import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class PostCheckService {

  constructor(private http: HttpClient, private _baseService: BaseService) {}

  // Post Check APIs
  getPostCheckList() {
    return this.http.get(`${APIConstant.postCheckList}`);
  }

  addPostCheck(payload: any) {
    return this.http.post(`${APIConstant.postCheckAdd}`, payload);
  }

  updatePostCheck(payload: any) {
    return this.http.post(`${APIConstant.postCheckEdit}`, payload);
  }

  getByIdPostCheck(id: number) {
    return this.http.get(`${APIConstant.postCheckGetById}?id=${id}`);
  }

  deletePostCheck(id: number) {
    return this.http.delete(`${APIConstant.postCheckDelete}?id=${id}`);
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
