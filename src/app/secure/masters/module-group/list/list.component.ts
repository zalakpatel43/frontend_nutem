import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { ModuleGroup } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { ModuleGroupService } from '../module-group.service';

@Component({
    templateUrl: './list.component.html'
})

export class ModuleGroupListComponent implements OnInit {

    moduleGroupData: ModuleGroup[] = [];
    page: string = ApplicationPage.moduleGroup;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private moduleGroupService: ModuleGroupService, private notificationService: ToastrService) {

    }

    ngOnInit(): void {
        this.getModuleGroupData();
    }

    private getModuleGroupData() {
        this.loading = true;

        this.moduleGroupService.get()
            .subscribe((result: ModuleGroup[]) => {
                this.moduleGroupData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleModuleGroup(moduleGroup: ModuleGroup, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this module group?`);
        if (result) {
            this.moduleGroupService.toggleActivate(moduleGroup.id, isActive)
                .subscribe(() => {
                    this.getModuleGroupData();
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