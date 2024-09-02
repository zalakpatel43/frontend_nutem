import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { DowntimeTrackingService } from '../downtime.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class DowntimeTrackingListComponent implements OnInit {

  downtimeTrackingData: any[] = [];
  page: string = ApplicationPage.downtimeTracking;
  permissions = PermissionType;
  isActive: boolean;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {
     // isActive: false
  };

  constructor(private downtimeTrackingService: DowntimeTrackingService,
              private notificationService: ToastrService) { }

  ngOnInit(): void {
      this.getDowntimeTrackingData();
  }

  private getDowntimeTrackingData() {
      this.loading = true;

      this.downtimeTrackingService.getDowntimeTrackingList()
          .subscribe((result: any) => {
              this.downtimeTrackingData = result;
              console.log("Downtime tracking list", this.downtimeTrackingData);
              this.loading = false;
          },
          (error) => {
              this.error = error;
              this.loading = false;
          });
  }

  removeDowntimeTracking(id: number) {
      const result = confirm(`Are you sure, you want to delete this Downtime Tracking?`);
      if (result) {
          this.downtimeTrackingService.deleteDowntimeTracking(id)
              .subscribe(() => {
                  this.getDowntimeTrackingData();
              }, () => {
                  this.notificationService.error("Something went wrong.");
              });
      }
  }

  updateSearch(search: { [key: string]: any }) {
      this.searchData = Object.assign({}, search);
      console.log("Search data", this.searchData);
  }

  isActiveRow(row) {
      return {
          'text-danger': !row.isActive
      };
  }
}
