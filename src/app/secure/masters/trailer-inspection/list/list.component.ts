import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ToastrService } from 'ngx-toastr';
import { TrailerInspectionService } from '../trailer-inspection.service';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
  selector: 'app-list',
  // standalone: true,
  // imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class TrailerInspectionListComponent  implements OnInit {

  trailerInspectionData: any[] = [];
  page: string = ApplicationPage.trailerInspection;
  permissions = PermissionType;
  isActive: boolean;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {
     // isActive: false
  };
  showDeleteModal : boolean = false;

  IsAddPemission:boolean = false;
  IsEditPermission: boolean = false;
  IsDeletePermission: boolean = false;

  constructor(private trailerInspectionService: TrailerInspectionService,
      private notificationService: ToastrService,
      private permissionService: PermissionService
    ) { }

  ngOnInit(): void {
    this.IsAddPemission = this.permissionService.hasPermission('Trailer Inspection (PER_TRAILERINSPECTION) - Add');
    this.IsEditPermission = this.permissionService.hasPermission('Trailer Inspection (PER_TRAILERINSPECTION) - Edit');
    this.IsDeletePermission = this.permissionService.hasPermission('Trailer Inspection (PER_TRAILERINSPECTION) - Delete');
      this.getTrailerInspectionData();
  }

  private getTrailerInspectionData() {
      this.loading = true;

      this.trailerInspectionService.getTrailerInspectionList()
          .subscribe((result: any) => {
              // this.cancel();
              this.trailerInspectionData = result;
            //  console.log("TrailerInspection list", this.trailerInspectionData);
              this.loading = false;
          },
              (error) => {
                  this.error = error;
                  this.loading = false;
              });
  }

  removeWeightCheck(id:number) {
      const result = confirm(`Are you sure, you want to delete this Trailer Inspection?`);
      if (result) {
          this.trailerInspectionService.DeleteTrailerInspection(id)
              .subscribe(() => {
                  this.getTrailerInspectionData();
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
