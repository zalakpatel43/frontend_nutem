import { Component, OnInit } from '@angular/core';
import { LaborVarianceService } from '../labor-variance.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from '../../permission/permission.service';
import { ApplicationPage, PermissionType } from '@app-core';


@Component({
  selector: 'app-list',
  // standalone: true,
  // imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class LaborVarianceListComponent  implements OnInit {

  LaborVarianceData: any[] = [];
  page: string = ApplicationPage.laborVariance;
  permissions = PermissionType;
  isActive: boolean;
  error: string;
  loading: boolean;

  IsAddPemission:boolean = true;
  IsEditPermission: boolean = true;
  IsDeletePermission: boolean = true;

  searchData: { [key: string]: any } = {
     // isActive: false
  };
  showDeleteModal : boolean = false;

  constructor(private laborVarinaceService: LaborVarianceService,
      private notificationService: ToastrService,
      private permissionService: PermissionService) { } 

  ngOnInit(): void {
      // this.IsAddPemission = this.permissionService.hasPermission('Weight Check (PER_WEIGHTCHECK) - Add');
      // this.IsEditPermission = this.permissionService.hasPermission('Weight Check (PER_WEIGHTCHECK) - Edit');
      // this.IsDeletePermission = this.permissionService.hasPermission('Weight Check (PER_WEIGHTCHECK) - Delete');
      this.getLaborVarinceData();
  }

  private getLaborVarinceData() {
      this.loading = true;

      this.laborVarinaceService.getLaborVarianceList()
          .subscribe((result: any) => {
              // this.cancel();
              this.LaborVarianceData = result;
             // console.log("Weight checl list", this.weightCheckData);
              this.loading = false;
          },
              (error) => {
                  this.error = error;
                  this.loading = false;
              });
  }

  removeLaborVarince(id:number) {
      const result = confirm(`Are you sure, you want to delete this Weight Check?`);
      if (result) {
          this.laborVarinaceService.DeleteLaborVariance(id)
              .subscribe(() => {
                  this.getLaborVarinceData();
              }, () => {
                  this.notificationService.error("Something went wrong.");
              });
      }
  }

  updateSearch(search: { [key: string]: any }) {
      this.searchData = Object.assign({}, search);
    //  console.log("serach data", this.searchData);
  }

  isActiveRow(row) {
      return {
          'text-danger': !row.isActive
      };
  }

  // removeWeightCheck(id:number){
  //     console.log("id for delete", id)
  //     this.showDeleteModal = true;
  // }

 
}
