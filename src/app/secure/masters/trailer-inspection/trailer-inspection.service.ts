import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class TrailerInspectionService {

  constructor(private http:HttpClient,
    private _baseService: BaseService) { }

    getTrailerInspectionList() {
      return this.http.get(`${APIConstant.TrailerInspectionList}`);
    }

    getComapnyList() {
      return this.http.get(`${APIConstant.CompanyMasterList}`);
    }

    getVehicleTypeList() {
      return this.http.get(`${APIConstant.VehicleTypeMasterList}`);
    }

    addTrailerInspection(playload){
      return this.http.post(`${APIConstant.TrailerInspectionAdd}`,playload);
    }

    updateTrailerInspection(playload){
      return this.http.post(`${APIConstant.TrailerInspectionEdit}`,playload);
    }

    getByIdTrailerInspection(id : number){
      return this.http.get(`${APIConstant.TrailerInspectionGetById}` + "?id=" + id);
    }

    DeleteTrailerInspection(id : number){
      return this.http.get(`${APIConstant.TrailerInspectionDelete}` + "?Id=" + id);
    }
}
