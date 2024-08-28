import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class AttributeCheckService {

  constructor(private http:HttpClient,
    private _baseService: BaseService) { }

    getAttributeCheckList() {
      return this.http.get(`${APIConstant.attributecheckList}`);
    }

    addAttributeCheck(playload){
      return this.http.post(`${APIConstant.attributecheckAdd}`,playload);
    }

    updateAttributeCheck(playload){
      return this.http.post(`${APIConstant.attributecheckEdit}`,playload);
    }

    getByIdAttributeCheck(id : number){
      return this.http.get(`${APIConstant.attributecheckGetById}` + "?id=" + id);
    }

    DeleteAttributeCheck(id : number){
      return this.http.delete(`${APIConstant.attributecheckDelete}` + "?id=" + id);
    }
}
