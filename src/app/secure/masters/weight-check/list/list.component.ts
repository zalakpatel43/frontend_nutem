import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { WeightCheckService } from '../weight-check.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  // standalone: false,
  // imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class WeightCheckListComponent implements OnInit {

  weightCheckData: any[] = [];
  page: string = ApplicationPage.weightCheck;
  permissions = PermissionType;
  isActive: boolean;
  error: string;
  loading: boolean;

  searchData: { [key: string]: any } = {
      isActive: false
  };

  constructor(private weightCheeckService: WeightCheckService, private notificationService: ToastrService) {}

  ngOnInit(): void {
      this.getWeightCheckData();
  }

  private getWeightCheckData() {
      this.loading = true;
      // this.weightCheeckService.get()
      //     .subscribe((result: Customer[]) => {
      //         this.customerData = result;
      //         this.loading = false;
      //     }, (error) => {
      //         console.log(error);
      //         this.loading = false;
      //     });
  }

  activateToggleCustomer(customer: any, isActive: boolean) {
      const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this customer?`);
      // if (result) {
      //     this.customerService.toggleActivate(customer.id, isActive)
      //         .subscribe(() => {
      //             this.getCustomerData();
      //         }, () => {
      //             this.notificationService.error("Something went wrong.");
      //         });
      // }
  }

  updateSearch(search: { [key: string]: any }) {
      this.searchData = Object.assign({}, search);
  }

  isActiveRow(row) {
      return {
          'text-danger': !row.isActive
      };
  }
}
