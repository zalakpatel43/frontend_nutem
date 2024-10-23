import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIConstant, BaseService } from '@app-core';

@Injectable({
  providedIn: 'root'
})
export class LiquidPreparationService {

  constructor(private http:HttpClient,
    private _baseService: BaseService) { }

    getStartEndBatchCheckList() {
      return this.http.get(`${APIConstant.StartEndBatchChecklist}`);
    }

    getTankMasterList() {
      return this.http.get(`${APIConstant.GetAllTankMaster}`);
    }

    getMaterialMasterList() {
      return this.http.get(`${APIConstant.GetAllMaterialMaster}`);
    }

    getProductInstructionDetailsList() {
      return this.http.get(`${APIConstant.GetAllProductInstructionDetails}`);
    }

    getQCTSpecificationMasterList() {
      return this.http.get(`${APIConstant.GetAllQCTSpecificationMaster}`);
    }

    getliquidPreparationList() {
      return this.http.get(`${APIConstant.LiquidPreparationList}`);
    }

    addLiquidPreparation(playload){
      return this.http.post(`${APIConstant.LiquidPreparationAdd}`,playload);
    }

    updateLiquidPreparation(playload){
      return this.http.post(`${APIConstant.LiquidPreparationEdit}`,playload);
    }

    getByIdLiquidPreparation(id : number){
      return this.http.get(`${APIConstant.LiquidPreparationGetById}` + "?id=" + id);
    }

    DeleteLiquidPreparation(id : number){
      return this.http.get(`${APIConstant.LiquidPreparationDelete}` + "?id=" + id);
    }

    getInstructionByProductId(id : number){
      return this.http.get(`${APIConstant.GetProductInstructionDetailsByProductId}` + "?productId=" + id);
    }
}
