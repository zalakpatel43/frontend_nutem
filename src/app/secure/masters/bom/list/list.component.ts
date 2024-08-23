import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { BOMMaster } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { BOMService } from '../bom.service';

@Component({
    templateUrl: './list.component.html'
})
export class BOMListComponent implements OnInit {

    bomData: BOMMaster[] = [];
    page: string = ApplicationPage.bom;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private bomService: BOMService, private notificationService: ToastrService) {}

    ngOnInit(): void {
        this.getBOMData();
    }

    private getBOMData() {
        this.loading = true;
        this.bomService.get()
            .subscribe((result: BOMMaster[]) => {
                this.bomData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleBOM(bom: BOMMaster, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this BOM?`);
        if (result) {
            this.bomService.toggleActivate(bom.id, isActive)
                .subscribe(() => {
                    this.getBOMData();
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
