import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Inward } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { InwardService } from '../inward.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './list.component.html',
    providers: [DatePipe]
})
export class InwardListComponent implements OnInit {

    inwardData: Inward[] = [];
    page: string = ApplicationPage.inward;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private inwardService: InwardService,
        private notificationService: ToastrService,
        public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.getInwardData();
    }

    private getInwardData() {
        this.loading = true;
        this.inwardService.get()
            .subscribe((result: Inward[]) => {
                this.inwardData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    exportToExcel(): void {
        let exportData: any[] = this.inwardData.map(x => {
            return {
                'Id': x.id,
                'Inward Code': x.inwardCode,
                'Inward Date': this.datePipe.transform(x.inwardDate, "dd/MM/yyyy"),
                'Inventory Type': x.inventoryTypeName,
                'From Warehouse': x.fromWarehouseName,
                'Customer Name': x.customerName,
                'Vendor Name': x.vendorName,
                'Warehouse': x.warehouseName,
                'Purchase Order No': x.purchaseOrderCode,
                'Supporting Document No': x.supportingDocumentNo,
                'Supporting Document Date': this.datePipe.transform(x.supportingDocumentDate, "dd/MM/yyyy"),
                'Active': x.isActive ? 'Yes' : 'No'
            };
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'Inwards.xlsx');
    }

    activateToggleInward(inward: Inward, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this inward?`);
        if (result) {
            this.inwardService.toggleActivate(inward.id, isActive)
                .subscribe(() => {
                    this.getInwardData();
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
