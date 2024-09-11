import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ListService } from '@app-core';
import { GroupPermission, List, PermissionModule, Permission, Role } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/secure/masters/role/role.service';

@Component({
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})

export class PermissionsAddEditComponent implements OnInit {

    isEditMode: boolean;
    isFormSubmitted: boolean;
    error: string;
    roleData: List[];
    moduleData: PermissionModule[];
    rolePermissionData: Role;
    selectedRole: number = 0;
    frmPermission: UntypedFormGroup;

    constructor(private roleService: RoleService, private listService: ListService,
        private notificationService: ToastrService,private formBuilder: UntypedFormBuilder,) {
            this.createForm();

    }

    createForm() {
        this.frmPermission = this.formBuilder.group({
            roleId: [''],
        });
    }

    ngOnInit(): void {
      //  this.getModulePermission();
        this.getRolesData();
    }

    private getRolesData() {
        this.roleService.getRole()
            .subscribe((result: any) => {
                this.roleData = result;
                if(this.roleData.length > 0)
                    {
                        this.frmPermission.controls.roleId.setValue(this.roleData[0].id);
                        this.getRolePermission();
                    }

            }, (error) => {
                console.log(error);

             });
        // this.listService.getList("role")
        //     .subscribe((result: any) => {
        //         this.roleData = result;
        //         if(this.roleData.length > 0)
        //         {
        //             this.frmPermission.controls.roleId.setValue(this.roleData[0].id);
        //             this.getRolePermission();
        //         }
        //     });
    }

    private getModulePermission() {
        this.listService.getModulePermissionList()
            .subscribe((result: PermissionModule[]) => {
                this.moduleData = result;
            });
    }

    private setPermissionData() {
        this.moduleData.forEach(item => {
            item.hasAllAccess = false;
            item.hasAllMasterAccess = false;

            item.moduleGroups.forEach(group => {
                group.permissions = group.permissions.map(permission => {
                    permission.hasAccess = this.rolePermissionData.permissions.some(x => x.id === permission.id)
                    permission.hasMasterAccess = permission.hasAccess ? this.rolePermissionData.permissions.find(x => x.id === permission.id).hasMasterAccess : false;
                    return permission;
                })
            })
        })
    }

    getRolePermission() {
        this.selectedRole = this.frmPermission.controls.roleId.value;
        this.roleService.getRoleById(this.selectedRole)
            .subscribe((result: any) => {
                this.rolePermissionData = result;
                this.setPermissionData();
            });
    }

    chkAllAccess(item: PermissionModule, event: any) {
        item.hasAllAccess = event.currentTarget.checked;

        item.moduleGroups.forEach(group => {
            group.permissions = group.permissions.map(permission => {
                permission.hasAccess = event.currentTarget.checked;
                return permission;
            })
        })
    }

    chkAllMasterAccess(item: PermissionModule, event: any) {
        item.hasAllMasterAccess = event.currentTarget.checked;

        item.moduleGroups.forEach(group => {
            group.permissions = group.permissions.map(permission => {
                permission.hasMasterAccess = event.currentTarget.checked;
                permission.hasAccess = permission.hasMasterAccess ? permission.hasMasterAccess : permission.hasAccess;
                return permission;
            })
        })
    }

    masterChanged(item: GroupPermission) {
        item.hasAccess = item.hasMasterAccess ? item.hasMasterAccess : item.hasAccess;
    }

    save() {
        let permissions: Permission[] = [];
        this.moduleData.forEach(item => {
            item.moduleGroups.forEach(group => {
                group.permissions.forEach(permission => {
                    if (permission.hasAccess) {
                        permissions.push({
                            id: permission.id,
                            hasMasterAccess: permission.hasMasterAccess,
                            permission: undefined,
                            view: undefined,
                            add: undefined,
                            edit: undefined,
                            delete: undefined,
                            export: undefined
                        })
                    }
                })
            })
        });

        let data = Object.assign({}, this.rolePermissionData, {
            permissions
        });

        this.roleService.updateRole(data.id, data)
            .subscribe((result) => {
                this.notificationService.success("Saved successfully.");
            }, (error) => {
                this.notificationService.error("Error while saving.");
            });
    }
}