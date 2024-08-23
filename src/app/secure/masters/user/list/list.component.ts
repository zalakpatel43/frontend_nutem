import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { User } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';

@Component({
    templateUrl: './list.component.html'
})

export class UserListComponent implements OnInit {

    userData: User[] = [];
    page: string = ApplicationPage.user;
    permissions = PermissionType;
    loading: boolean;
    isActive: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    }

    constructor(private userService: UserService, private notificationService: ToastrService) {

    }

    ngOnInit(): void {
        this.getUserData();
    }

    private getUserData() {
        this.loading = true;

        this.userService.get()
            .subscribe((result: any) => {
                this.loading = false;
                this.userData = result;
            }, (error) => {
                this.loading = false;
                console.log(error);
            });
    }

    getRoles(roles: any) {
        var userRoles = "";
        roles.forEach((item, i) => {
            if (i == 0) {
                userRoles = item.roleName;
            }
            else {
                userRoles = userRoles + ', ' + item.roleName;
            }
        });

        return userRoles;
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
        console.log("search", search)
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }

    toggleActivate(townId: number, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Active` : `Inactive`} ?`);
        if (result) {
            this.userService.toggleActivate(townId, isActive)
                .subscribe((result) => {
                    if (result.isSuccess) {
                        this.getUserData();
                    }
                    else {
                        this.notificationService.warning(result.message);
                    }
                }, (error) => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }
}