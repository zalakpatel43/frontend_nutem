import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { GroupCode } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { GroupCodeService } from '../group-code.service';

@Component({
    templateUrl: './list.component.html'
})
export class GroupCodeListComponent implements OnInit {

    groupCodeData: GroupCode[] = [];
    page: string = ApplicationPage.group_code;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private groupCodeService: GroupCodeService, private notificationService: ToastrService) {}

    ngOnInit(): void {
        this.getGroupCodeData();
    }

    private getGroupCodeData() {
        this.loading = true;
        this.groupCodeService.get()
            .subscribe((result: GroupCode[]) => {
                this.groupCodeData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleGroupCode(groupCode: GroupCode, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this group code?`);
        if (result) {
            this.groupCodeService.toggleActivate(groupCode.id, isActive)
                .subscribe(() => {
                    this.getGroupCodeData();
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
