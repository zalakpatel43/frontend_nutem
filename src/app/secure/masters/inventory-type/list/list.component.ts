import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { PageEvent } from '@angular/material/paginator'; // Updated import
import { InventoryTypeService } from '../inventory-type.service';
import { InventoryType } from '@app-models';
import { ApplicationPage, PermissionType } from '@app-core';

@Component({
    templateUrl: './list.component.html'
})
export class InventoryTypeListComponent implements OnInit {
    inventoryTypeData: InventoryType[] = [];
    page: string = ApplicationPage.inventoryType;
    permissions = PermissionType;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    loading = false;
    totalCount = 0;
    currentPage = 1;

    constructor(private inventoryTypeService: InventoryTypeService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.loadInventoryTypes();
    }

    loadInventoryTypes(page: number = 1): void {
        this.loading = true;
        this.inventoryTypeService.get()
            .subscribe(data => {
                this.inventoryTypeData = data;
                this.totalCount = data.length;
                this.loading = false;
            }, error => {
                this.toastr.error(error.message, 'Error');
                this.loading = false;
            });
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }

    paginate(event: PageEvent): void {
        this.currentPage = event.pageIndex + 1; // Updated property access
        this.loadInventoryTypes(this.currentPage);
    }

    exportToExcel(): void {
        let exportData: any[] = this.inventoryTypeData.map(x => {
            return {
                'Id': x.id,
                'Inventory Type Code': x.inventoryTypeCode,
                'Inventory Type Name': x.inventoryTypeName,
                'Inward Type': x.inwardType,
                'Applicable To': x.applicableToName,
                'Sales': x.sales,
                'Purchase': x.purchase,
                'Reserve': x.reserve,
                'Admin': x.admin,
                'Active': x.isActive ? 'Yes' : 'No'
            };
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'Inventory_Types.xlsx');
    }

    toggleActivateInventoryType(inventoryType: InventoryType, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this inventory type?`);
        if (result) {
            this.inventoryTypeService.toggleActivate(inventoryType.id, isActive)
                .subscribe(() => {
                    this.loadInventoryTypes();
                }, (error) => {
                    this.toastr.error("Something went wrong.");
                });
        }
    }
}
