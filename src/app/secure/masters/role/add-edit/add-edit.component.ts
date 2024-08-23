import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Role } from '@app-models';
import { RoleService } from '../role.service';


@Component({
    templateUrl: './add-edit.component.html'
})

export class RoleAddEditComponent implements OnInit, OnDestroy {
    roleData: Role;
    roleId: number;
    isEditMode: boolean;
    frmRole: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.role;
    permissions = PermissionType;
    error: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private roleService: RoleService,
        private notificationService: ToastrService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getRoleRoute();
    }

    private getRoleRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.roleId = params.id //+params["id"];
                this.getRoleDetails();
            }
        });
    }

    private getRoleDetails() {
        this.roleService.getById(this.roleId)
            .subscribe((result: Role) => {
                this.roleData = result;
                this.setRoleData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setRoleData() {
        this.frmRole.controls['name'].setValue(this.roleData.name);
    }

    createForm() {
        this.frmRole = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]]
        });
    }

    private createRole() {
        let role :Role = this.frmRole.value;
       let PlayLoad = {
        name : role.name,
        Code : role.name
       }
        this.roleService.add(role)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Role saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateRole() {
        let role: Role = this.frmRole.value;
        this.roleData = Object.assign(this.roleData, this.roleData, role);

        this.roleService.update(this.roleData.id, this.roleData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Role uddated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmRole.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateRole();
        }
        else {
            this.createRole();
        }
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        }
        else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }
}