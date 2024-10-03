import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ToastrService } from 'ngx-toastr';
import { LiquidPreparationService } from '../liquid-preparation.service';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
  selector: 'app-list',
  // standalone: true,
  // imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class LiquidPreparationListComponent implements OnInit {

  liquidPreparationData: any[] = [];
    page: string = ApplicationPage.liquidPreparation;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;
  
    searchData: { [key: string]: any } = {
       // isActive: false
    };
  
    IsAddPemission:boolean = false;
    IsEditPermission: boolean = false;
    IsDeletePermission: boolean = false;

    constructor(private liquidPreparationService: LiquidPreparationService,
        private notificationService: ToastrService,
        private permissionService: PermissionService) { }
  
    ngOnInit(): void {
        this.IsAddPemission = this.permissionService.hasPermission('Liquid Preparation (PER_LIQUIDPREPARATION) - Add');
        this.IsEditPermission = this.permissionService.hasPermission('Liquid Preparation (PER_LIQUIDPREPARATION) - Edit');
        this.IsDeletePermission = this.permissionService.hasPermission('Liquid Preparation (PER_LIQUIDPREPARATION) - Delete');
        this.getliquidPreparationData();
    }
  
    private getliquidPreparationData() {
        this.loading = true;
  
        this.liquidPreparationService.getliquidPreparationList()
            .subscribe((result: any) => {
                // this.cancel();
                this.liquidPreparationData = result;
              //  console.log("liquidPreparationData list", this.liquidPreparationData);
                this.loading = false;
            },
                (error) => {
                    this.error = error;
                    this.loading = false;
                });
    }
  
    removeliquidPreparation(id:number) {
        const result = confirm(`Are you sure, you want to delete this Liquid Preparation?`);
        if (result) {
            this.liquidPreparationService.DeleteLiquidPreparation(id)
                .subscribe(() => {
                    this.getliquidPreparationData();
                }, () => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }
  
    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
       // console.log("serach data", this.searchData);
    }
  
    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }
  
   
}
