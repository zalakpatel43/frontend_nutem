import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class LaborVarianceService {
  constructor(private http:HttpClient,
    private _baseService: BaseService) { }

    getLaborVarianceList() {
      return this.http.get(`${APIConstant.laborVarinceList}`);
    }

    addLaborVariance(playload){
      return this.http.post(`${APIConstant.laborVarinceAdd}`,playload);
    }

    updateLaborVariance(playload){
      return this.http.post(`${APIConstant.laborVarinceEdit}`,playload);
    }

    getByIdLaborVariance(id : number){
      return this.http.get(`${APIConstant.laborVarinceGetById}` + "?id=" + id);
    }

    DeleteLaborVariance(id : number){
      return this.http.get(`${APIConstant.laborVarinceDelete}` + "?id=" + id);
    }
}
