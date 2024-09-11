import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { PermissionService } from '../permission.service';  // Adjust the import path as needed
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  // standalone: true,
  // imports: [],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']  // Adjusted for plural form
})
export class PermissionListComponent implements OnInit {

  permissionData: any[] = [];
  page: string = ApplicationPage.permissioon;  // Adjusted for permissions
  permissions = PermissionType;
  isActive: boolean;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {
     // isActive: false
  };

  constructor(private permissionService: PermissionService,
      private notificationService: ToastrService) { }

  ngOnInit(): void {
      this.getPermissionData();
  }

  private getPermissionData() {
      this.loading = true;

      this.permissionService.getPermissionList()
          .subscribe((result: any) => {
              this.permissionData = result;
              console.log("permission list", this.permissionData);
              this.loading = false;
          },
          (error) => {
              this.error = error;
              this.loading = false;
          });
  }

  removePermission(id: number) {
      const result = confirm(`Are you sure you want to delete this permission?`);
      if (result) {
          this.permissionService.deletePermission(id)
              .subscribe(() => {
                  this.getPermissionData();
              }, () => {
                  this.notificationService.error("Something went wrong.");
              });
      }
  }

  updateSearch(search: { [key: string]: any }) {
      this.searchData = Object.assign({}, search);
      console.log("search data", this.searchData);
  }

  isActiveRow(row) {
      return {
          'text-danger': !row.isActive
      };
  }

}
