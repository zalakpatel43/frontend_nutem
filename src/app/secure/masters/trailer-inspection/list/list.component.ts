import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ToastrService } from 'ngx-toastr';
import { TrailerInspectionService } from '../trailer-inspection.service';

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

  constructor(private trailerInspectionService: TrailerInspectionService,
      private notificationService: ToastrService) { }

  ngOnInit(): void {
      this.getTrailerInspectionData();
  }

  private getTrailerInspectionData() {
      this.loading = true;

      this.trailerInspectionService.getTrailerInspectionList()
          .subscribe((result: any) => {
              // this.cancel();
              this.trailerInspectionData = result;
              console.log("TrailerInspection list", this.trailerInspectionData);
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
      console.log("serach data", this.searchData);
  }

  isActiveRow(row) {
      return {
          'text-danger': !row.isActive
      };
  }

}
