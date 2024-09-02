import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class DowntimeTrackingService {



  constructor(private http: HttpClient,
              private _baseService: BaseService) { }

  getDowntimeTrackingList() {
    return this.http.get(`${APIConstant.downtimeTrackingList}`);
  }
  getShiftList() {
    return this.http.get(`${APIConstant.ShiftList}`);
  }
  getCauseList() {
    return this.http.get(`${APIConstant.CauseList}`);
  }
  getMaster() {
    return this.http.get(`${APIConstant.MasterList}`);
  }
  
  getUserList() {
    return this.http.get(`${APIConstant.UserList}`);
  }
  getProductionOrderList() {
    return this.http.get(`${APIConstant.ProductionOrderList}`);
  }
  getProductList() {
    return this.http.get(`${APIConstant.ProductList}`);
  }

  addDowntimeTracking(payload) {
    return this.http.post(`${APIConstant.downtimeTrackingAdd}`, payload);
  }

  updateDowntimeTracking(payload) {
    return this.http.post(`${APIConstant.downtimeTrackingEdit}`, payload);
  }
  

  getByIdDowntimeTracking(id: number) {
    return this.http.get(`${APIConstant.downtimeTrackingGetById}` + "?id=" + id);
  }

  deleteDowntimeTracking(id: number) {
    return this.http.delete(`${APIConstant.downtimeTrackingDelete}` + "?id=" + id);
  }
}
