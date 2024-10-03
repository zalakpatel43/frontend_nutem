import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { User } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
 
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
    
})
export class UserListComponent implements OnInit {
    userData: User[] = [];
    page: string = ApplicationPage.user;
    permissions = PermissionType;
    loading: boolean;
    isActive: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    // Pagination variables
    pageIndex: number = 1;
    pageSize: number = 10;
    totalItems: number = 0;

    IsAddPemission: boolean = false;
    IsEditPermission: boolean = false;
    IsDeletePermission: boolean = false;

    constructor(private userService: UserService, private notificationService: ToastrService,
        private permissionService: PermissionService
    ) { }

    ngOnInit(): void {
        this.IsAddPemission = this.permissionService.hasPermission('User (PER_USER) - Add');
        this.IsEditPermission = this.permissionService.hasPermission('User (PER_USER) - Edit');
        this.IsDeletePermission = this.permissionService.hasPermission('User (PER_USER) - Delete');
        this.getUserData();
    }

    private getUserData() {
        this.loading = true;

        this.userService.getUsers(this.pageIndex, this.pageSize)
            .subscribe((result: any) => {
                this.loading = false;
                this.userData = result.items; // Assuming the API response has an 'items' property
                this.totalItems = result.totalCount; // Assuming the API response has a 'totalCount' property
            }, (error) => {
                this.loading = false;
                console.log(error);
            });
    }

    // Update the pageIndex and fetch data when user navigates through pages
    onPageChange(event: any) {
        this.pageIndex = event.pageIndex + 1; // ngx-datatable uses 0-based index
        this.getUserData();
    }

    getRoles(roles: any) {
        return roles.map((item: any) => item.roleName).join(', ');
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = { ...search };
       // console.log("search", search);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }

    toggleActivate(townId: number) {
        const result = confirm(`Are you sure you want to delete User ?`);
        if (result) {
            this.userService.deleteUser(townId)
                .subscribe((result) => {
                    if (result) {
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
