import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Outward } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { OutwardService } from '../outward.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './list.component.html',
    providers: [DatePipe]
})
export class OutwardListComponent implements OnInit {

    outwardData: Outward[] = [];
    page: string = ApplicationPage.outward;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private outwardService: OutwardService,
        private notificationService: ToastrService,
        public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.getOutwardData();
    }

    private getOutwardData() {
        this.loading = true;
        this.outwardService.get()
            .subscribe((result: Outward[]) => {
                this.outwardData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    exportToExcel(): void {
        let exportData: any[] = this.outwardData.map(x => {
            return {
                'Id': x.id,
                'Outward Code': x.outwardCode,
                'Outward Date': this.datePipe.transform(x.outwardDate, "dd/MM/yyyy"),
                'Inventory Type': x.inventoryTypeName,
                'From Warehouse': x.fromWarehouseName,
                'Customer Name': x.customerName,
                'Vendor Name': x.vendorName,
                'Warehouse': x.warehouseName,
                'Material Requisition No': x.materialRequisitionCode,
                'Supporting Document No': x.supportingDocumentNo,
                'Supporting Document Date': this.datePipe.transform(x.supportingDocumentDate, "dd/MM/yyyy"),
                'Active': x.isActive ? 'Yes' : 'No'
            };
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'Outwards.xlsx');
    }

    activateToggleOutward(outward: Outward, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this outward?`);
        if (result) {
            this.outwardService.toggleActivate(outward.id, isActive)
                .subscribe(() => {
                    this.getOutwardData();
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