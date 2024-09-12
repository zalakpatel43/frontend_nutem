import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility } from '@app-core';
import { Permission, Role } from '@app-models';
import { RoleService } from '../role.service';

@Component({
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.scss']
})
export class RoleAddEditComponent implements OnInit, OnDestroy {
    roleData: Role;
    roleId: number;
    isEditMode: boolean;
    frmRole: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.role;
    error: string;

    Permissions = [
        { permission: 'Dashboard', view: false, add: false, edit: false, delete: false },
        { permission: 'User', view: false, add: false, edit: false, delete: false },
        { permission: 'Role', view: false, add: false, edit: false, delete: false },
        { permission: 'Weight Check', view: false, add: false, edit: false, delete: false },
        { permission: 'Attribute Check', view: false, add: false, edit: false, delete: false },
        { permission: 'PreCheck List', view: false, add: false, edit: false, delete: false },
        { permission: 'PostCheck List', view: false, add: false, edit: false, delete: false },
        { permission: 'Liquid Preparation', view: false, add: false, edit: false, delete: false },
        { permission: 'Trailer Loading', view: false, add: false, edit: false, delete: false },
        { permission: 'Trailer Inspection', view: false, add: false, edit: false, delete: false },
        { permission: 'Pallet Packing', view: false, add: false, edit: false, delete: false },
        { permission: 'DownTime Tracking', view: false, add: false, edit: false, delete: false },
        { permission: 'Producion Order', view: false, add: false, edit: false, delete: false },
        // Add more permissions as needed...
    ];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private roleService: RoleService,
        private notificationService: ToastrService
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getRoleRoute();
    }

    private getRoleRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.roleId = +params.id;
                this.getRoleDetails();
            }
        });
    }


    private getRoleDetails() {
        this.roleService.getRoleById(this.roleId)
            .subscribe((result: any) => {
                this.roleData = result;
                this.setRoleData();
            },
                (error) => {
                    console.error(error);
                    this.notificationService.error("Error fetching role details: " + error.message);
                });
    }

    createForm() {
        this.frmRole = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            Permissions: this.formBuilder.array(
                this.Permissions.map(permission => this.createPermissionGroup(permission))
            )
        });
    }

    private setRoleData() {
        const permissionFormArray = this.frmRole.get('permissions') as UntypedFormArray;
        permissionFormArray.clear(); // Clear previous values

        // Check if permissions exist before trying to iterate over them
        if (this.roleData && this.roleData.Permissions) {
            this.roleData.Permissions.forEach((perm: Permission) => {
                permissionFormArray.push(
                    this.formBuilder.group({
                        permission: [perm.permission],
                        view: [perm.IsList],
                        add: [perm.IsAdd],
                        edit: [perm.IsEdit],
                        delete: [perm.IsDelete],
                        code: [perm.Code]
                    })
                );
            });
        } else {
            console.warn('No permissions found for this role.');
        }

        console.log(this.frmRole.value); // Debugging: Check form value
    }



    // private createRole() {
    //     const role: Role = this.frmRole.value;
    //     const payload: Role = {
    //         id: 0, // or an appropriate value if updating
    //         name: role.name,
    //         assignedPermissions: role.permissions,
    //         permissions: []
    //     };
    //     this.roleService.addRole(payload).subscribe(
    //         () => {
    //             this.cancel();
    //             this.notificationService.success("Role created successfully.");
    //         },
    //         (error) => {
    //             this.error = error;
    //             this.notificationService.error("Error creating role: " + error.message);
    //         }
    //     );
    // }
    createRole() {
        const role: Role = this.frmRole.value;

        // Transform permissions into the required format
        const transformedPermissions = this.transformPermissions(role.Permissions);

        const payload: Role = {
            id: 0, // or an appropriate value if updating
            name: role.name,
            Permissions: transformedPermissions, // Assign to permissions field
            assignedPermissions: [] // Leave empty or adjust as needed
        };

        this.roleService.addRole(payload).subscribe(
            () => {
                this.cancel();
                this.notificationService.success("Role created successfully.");
            },
            (error) => {
                this.error = error;
                this.notificationService.error("Error creating role: " + error.message);
            }
        );
    }
    createPermissionGroup(permission: any): UntypedFormGroup {
        return this.formBuilder.group({
            permission: [permission.permission],
            view: [permission.view],
            add: [permission.add],
            edit: [permission.edit],
            delete: [permission.delete]
        });
    }
    // private updateRole() {
    //     const role: Role = this.frmRole.value;
    //     const payload: Role = {
    //         ...this.roleData,
    //         name: role.name,
    //         assignedPermissions: role.permissions
    //     };

    //     this.roleService.updateRole(this.roleData.id, payload).subscribe(
    //         () => {
    //             this.cancel();
    //             this.notificationService.success("Role updated successfully.");
    //         },
    //         (error) => {
    //             this.error = error;
    //             this.notificationService.error("Error updating role: " + error.message);
    //         }
    //     );
    // }
    private updateRole() {
        const role: Role = this.frmRole.value;

        // Transform permissions into the required format
        const transformedPermissions = this.transformPermissions(role.Permissions);

        const payload: Role = {
            ...this.roleData,
            name: role.name,
            Permissions: transformedPermissions // Assign to permissions field
        };

        this.roleService.updateRole(this.roleData.id, payload).subscribe(
            () => {
                this.cancel();
                this.notificationService.success("Role updated successfully.");
            },
            (error) => {
                this.error = error;
                this.notificationService.error("Error updating role: " + error.message);
            }
        );
    }
    private transformPermissions(formPermissions: any[]): any[] {
        return formPermissions.map(permission => ({
            Code: this.mapPermissionToCode(permission.permission),
            IsList: permission.view,
            IsAdd: permission.add,
            IsEdit: permission.edit,
            IsDelete: permission.delete,
            IsExport: false // Set to false or include logic if export permissions are required
        }));
    }

    private mapPermissionToCode(permissionName: string): string {
        // Map permission names to codes. Adjust this mapping as needed.
        const permissionMap = {
            'Dashboard': 'PER_DASHBOARD',
            'User': 'PER_USER',
            'Role': 'PER_ROLE',
            'Weight Check': 'PER_WEIGHTCHECK',
            'Attribute Check': 'PER_ATTRIBUTECHECK',
            'PreCheck List': 'PER_PRECHEKLIST',
            'Liquid Preparation': 'PER_LIQUIDPREPARATION',
            'PostCheck List': 'PER_POSTCHEKLIST',
            'Downtime Checking': 'PER_DOWNTIMECHECKING',
            'Pallet Packing': 'PER_PALLETPACKING',
            'Purchase Order': 'PER_PURCHASEORDER'
        };

        return permissionMap[permissionName] || 'UNKNOWN_CODE'; // Default to UNKNOWN_CODE if not found
    }
    save() {
        this.isFormSubmitted = true;
        if (this.frmRole.invalid) {
            this.notificationService.error("Please fill all required fields.");
            return;
        }

        if (this.isEditMode) {
            this.updateRole();
        } else {
            this.createRole();
        }
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    ngOnDestroy(): void {
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }
    }
}
