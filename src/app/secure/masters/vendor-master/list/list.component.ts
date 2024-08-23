import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { VendorMaster } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { VendorMasterService } from '../vendor-master.service';

@Component({
    templateUrl: './list.component.html'
})

export class VendorMasterListComponent implements OnInit {

    vendorMasterData: VendorMaster[] = [];
    page: string = ApplicationPage.vendorMaster;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private vendorMasterService: VendorMasterService, private notificationService: ToastrService) { }

    ngOnInit(): void {
        this.getVendorMasterData();
    }

    private getVendorMasterData() {
        this.loading = true;
        this.vendorMasterService.get()
            .subscribe((result: VendorMaster[]) => {
                this.vendorMasterData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleVendorMaster(vendorMaster: VendorMaster, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this vendor?`);
        if (result) {
            this.vendorMasterService.toggleActivate(vendorMaster.id, isActive)
                .subscribe(() => {
                    this.getVendorMasterData();
                }, (error) => {
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
