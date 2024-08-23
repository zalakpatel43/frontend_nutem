import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { MaterialRequisition } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { MaterialRequisitionService } from '../material-requisition.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './list.component.html',
    providers: [DatePipe]
})
export class MaterialRequisitionListComponent implements OnInit {

    materialRequisitionData: MaterialRequisition[] = [];
    page: string = ApplicationPage.materialRequisition;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private materialRequisitionService: MaterialRequisitionService,
        private notificationService: ToastrService,
        public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.getMaterialRequisitionData();
    }

    private getMaterialRequisitionData() {
        this.loading = true;
        this.materialRequisitionService.get()
            .subscribe((result: MaterialRequisition[]) => {
                this.materialRequisitionData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    exportToExcel(): void {
        let exportData: any[] = this.materialRequisitionData.map(x => {
            return {
                'Id': x.id,
                'Material Requisition Code': x.materialRequisitionCode,
                'Material Requisition Date': this.datePipe.transform(x.materialRequisitionDate, "dd/MM/yyyy"),
                'Expected Date': this.datePipe.transform(x.expectedDate, "dd/MM/yyyy"),
                'Warehouse': x.warehouseName,
                'Customer Name': x.customerName,
                'Shipping Address': x.shippingAddress,
                'Billing Address': x.billingAddress,
                'Active': x.isActive ? 'Yes' : 'No'
            };
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'MaterialRequisitions.xlsx');
    }

    activateToggleMaterialRequisition(materialRequisition: MaterialRequisition, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this material requisition?`);
        if (result) {
            this.materialRequisitionService.toggleActivate(materialRequisition.id, isActive)
                .subscribe(() => {
                    this.getMaterialRequisitionData();
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
