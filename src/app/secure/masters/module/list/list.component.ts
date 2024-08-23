import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Module } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { ModuleService } from '../module.service';

@Component({
    templateUrl: './list.component.html'
})
export class ModuleListComponent implements OnInit {

    moduleData: Module[] = [];
    page: string = ApplicationPage.module;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private moduleService: ModuleService, private notificationService: ToastrService) {}

    ngOnInit(): void {
        this.getModuleData();
    }

    private getModuleData() {
        this.loading = true;
        this.moduleService.get()
            .subscribe((result: Module[]) => {
                this.moduleData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleModule(module: Module, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this module?`);
        if (result) {
            this.moduleService.toggleActivate(module.id, isActive)
                .subscribe(() => {
                    this.getModuleData();
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
