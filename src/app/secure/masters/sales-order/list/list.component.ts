import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { SalesOrder } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { SalesOrderService } from '../sales-order.service';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './list.component.html',
    providers: [DatePipe]
})
export class SalesOrderListComponent implements OnInit {

    salesOrderData: SalesOrder[] = [];
    page: string = ApplicationPage.salesOrder;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private salesOrderService: SalesOrderService, 
        private notificationService: ToastrService,
        public datePipe: DatePipe) {}

    ngOnInit(): void {
        this.getSalesOrderData();
    }

    private getSalesOrderData() {
        this.loading = true;
        this.salesOrderService.get()
            .subscribe((result: SalesOrder[]) => {
                this.salesOrderData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleSalesOrder(salesOrder: SalesOrder, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this sales order?`);
        if (result) {
            this.salesOrderService.toggleActivate(salesOrder.id, isActive)
                .subscribe(() => {
                    this.getSalesOrderData();
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
