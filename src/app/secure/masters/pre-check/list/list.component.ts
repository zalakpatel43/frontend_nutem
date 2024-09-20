import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { PreCheckService } from '../pre-check.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
  selector: 'pre-check-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PreCheckListComponent implements OnInit {

  preCheckData: any[] = [];
  page: string = ApplicationPage.preCheck;
  permissions = PermissionType;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {};

  IsAddPemission:boolean = false;
  IsEditPermission: boolean = false;
  IsDeletePermission: boolean = false;

  constructor(private preCheckService: PreCheckService,
              private notificationService: ToastrService,
              private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.IsAddPemission = this.permissionService.hasPermission('PreCheck List (PER_PRECHEKLIST) - Add');
    this.IsEditPermission = this.permissionService.hasPermission('PreCheck List (PER_PRECHEKLIST) - Edit');
    this.IsDeletePermission = this.permissionService.hasPermission('PreCheck List (PER_PRECHEKLIST) - Delete');
    this.getPreCheckData();
  }

  private getPreCheckData() {
    this.loading = true;

    this.preCheckService.getPreCheckList()
      .subscribe((result: any) => {
        this.preCheckData = result.filter((list: any) => list.isActive === true);
        this.loading = false;
      },
      (error) => {
        this.error = error;
        this.loading = false;
      });
  }

  removePreCheck(id: number) {
    const result = confirm(`Are you sure you want to delete this Pre-Check?`);
    if (result) {
      this.preCheckService.deletePreCheck(id)
        .subscribe(() => {
          this.getPreCheckData();
        }, () => {
          this.notificationService.error("Something went wrong.");
        });
    }
  }

  updateSearch(search: { [key: string]: any }) {
    this.searchData = Object.assign({}, search);
  }
}
