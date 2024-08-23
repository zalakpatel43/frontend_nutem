import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Role } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../role.service';

@Component({
    templateUrl: './list.component.html'
})

export class RoleListComponent implements OnInit {

    roleData: Role[] = [];
    page: string = ApplicationPage.role;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private roleService: RoleService, private notificationService: ToastrService) {

    }

    ngOnInit(): void {
        this.getRoleData();
    }

    private getRoleData() {
    this.loading = true;

        this.roleService.get()
            .subscribe((result: any) => {
                this.roleData = result;
    this.loading = false;

            }, (error) => {
                console.log(error);
    this.loading = false;

            });
    }

    activateToggleRole(role: Role, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Active` : `Inactive`} ?`);
        if (result) {
            this.roleService.toggleActivate(role.id, isActive)
                .subscribe((result) => {
                    this.getRoleData();
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
