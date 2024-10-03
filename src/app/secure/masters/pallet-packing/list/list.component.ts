import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { PalletPackingService } from '../pallet-packing.service';
import { ToastrService } from 'ngx-toastr';
import { PalletPacking } from 'src/app/model/pallet-packing';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
    selector: 'app-pallet-packing-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class PalletPackingListComponent implements OnInit {

    palletPackingData: PalletPacking[] = [];
    page: string = ApplicationPage.palletPacking;
    permissions = PermissionType;
    error: string;
    loading: boolean;
    searchData: { [key: string]: any } = {};
    showDeleteModal: boolean = false;

    IsAddPemission:boolean = false;
    IsEditPermission: boolean = false;
    IsDeletePermission: boolean = false;

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

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
      //  console.log("search data", this.searchData);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }
}
