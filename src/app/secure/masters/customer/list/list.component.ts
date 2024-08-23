import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Customer } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../customer.service';

@Component({
    templateUrl: './list.component.html'
})
export class CustomerListComponent implements OnInit {

    customerData: Customer[] = [];
    page: string = ApplicationPage.customer;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private customerService: CustomerService, private notificationService: ToastrService) {}

    ngOnInit(): void {
        this.getCustomerData();
    }

    private getCustomerData() {
        this.loading = true;
        this.customerService.get()
            .subscribe((result: Customer[]) => {
                this.customerData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleCustomer(customer: Customer, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this customer?`);
        if (result) {
            this.customerService.toggleActivate(customer.id, isActive)
                .subscribe(() => {
                    this.getCustomerData();
                }, () => {
                    this.notificationService.error("Something went wrong.");
                });
        }
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
