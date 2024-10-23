import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { PalletPackingService } from '../pallet-packing.service';
import { ToastrService } from 'ngx-toastr';
import { PalletPacking } from 'src/app/model/pallet-packing';
import { PermissionService } from 'src/app/core/service/permission.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-pallet-packing-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class PalletPackingListComponent implements OnInit {

    palletPackingData: PalletPacking[] = [];
    filteredpalletPackingData: PalletPacking[] = []; // = new MatTableDataSource<any>([]);
    page: string = ApplicationPage.palletPacking;
    permissions = PermissionType;
    error: string;
    loading: boolean;
    searchData: { [key: string]: any } = {};
    showDeleteModal: boolean = false;

    IsAddPemission: boolean = false;
    IsEditPermission: boolean = false;
    IsDeletePermission: boolean = false;
    searchTerm: string = '';

    constructor(private palletPackingService: PalletPackingService,
        private notificationService: ToastrService,
        private permissionService: PermissionService) { }

    ngOnInit(): void {
        this.IsAddPemission = this.permissionService.hasPermission('Pallet Packing (PER_PALLETPACKING) - Add');
        this.IsEditPermission = this.permissionService.hasPermission('Pallet Packing (PER_PALLETPACKING) - Edit');
        this.IsDeletePermission = this.permissionService.hasPermission('Pallet Packing (PER_PALLETPACKING) - Delete');
        this.getPalletPackingData();
    }

    private getPalletPackingData() {
        this.loading = true;

        this.palletPackingService.getPalletPackingList()
            .subscribe((result: any) => {
                this.palletPackingData = result;
                this.filteredpalletPackingData = result;
                //  console.log("Pallet Packing list", this.palletPackingData);
                this.loading = false;
            },
                (error) => {
                    this.error = error;
                    this.loading = false;
                });
    }

    removePalletPacking(id: number) {
        const result = confirm(`Are you sure you want to delete this Pallet Packing?`);
        if (result) {
            this.palletPackingService.deletePalletPacking(id)
                .subscribe(() => {
                    this.getPalletPackingData();
                }, () => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }

    // Method to update search results based on emitted data from the search panel
    updateSearch(search: { [key: string]: any }) {
        this.searchData = { ...search };  // Store the search data

        // Filtering logic based on code, poNumber, and status
        this.filteredpalletPackingData = this.palletPackingData.filter(order => {
            const searchText = this.searchData.searchText ? this.searchData.searchText.toLowerCase() : '';
            console.log("search text ", searchText);
            const matchesPONumber = order.poNumber.toLowerCase().includes(searchText);
            const matchesproductName = order.productName.toString().includes(searchText);
            const formattedDate = new Date(order.packingDateTime).toLocaleDateString(); // You can customize the format as needed
            const matchesDate = formattedDate.includes(searchText);

            // Combine all search filters
            return (matchesproductName || matchesPONumber || matchesDate);
        });
    }

    updateFilter() {
        const searchTermLower = this.searchTerm.toLowerCase();

        this.filteredpalletPackingData = this.palletPackingData.filter((row) =>
            Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(searchTermLower)
            )
        );
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }
}
