import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { Module, ModuleGroup, PermissionModule } from '@app-models';
import { ModuleGroupService } from '../module-group.service';

@Component({
    templateUrl: './add-edit.component.html'
})

export class ModuleGroupAddEditComponent implements OnInit, OnDestroy {
    moduleGroupData: ModuleGroup;
    moduleGroupId: number;
    isEditMode: boolean;
    frmModuleGroup: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.moduleGroup;
    permissions = PermissionType;
    error: string;
    modules = [];

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private moduleGroupService: ModuleGroupService,
        private notificationService: ToastrService, private listService: ListService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getModuleGroupRoute();
        this.loadModules();
    }

    private getModuleGroupRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.moduleGroupId = +params["id"];
                this.getModuleGroupDetails();
            }
        });
    }

    private getModuleGroupDetails() {
        this.moduleGroupService.getById(this.moduleGroupId)
            .subscribe((result: ModuleGroup) => {
                this.moduleGroupData = result;
                this.setModuleGroupData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setModuleGroupData() {
        this.frmModuleGroup.patchValue(this.moduleGroupData);
    }

    private createForm() {
        this.frmModuleGroup = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            code: ['', [Validators.required, Validators.maxLength(50)]],
            priority: [null, [Validators.required]],
            moduleId: [null, [Validators.required]],
            createdBy: [null],
            createdOn: [null],
            modifiedBy: [null],
            modifiedOn: [null]
        });
    }

    private createModuleGroup() {
        let moduleGroup: ModuleGroup = this.frmModuleGroup.value;
        this.moduleGroupService.add(moduleGroup)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Module Group saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateModuleGroup() {
        let moduleGroup: ModuleGroup = this.frmModuleGroup.value;
        this.moduleGroupData = Object.assign(this.moduleGroupData, this.moduleGroupData, moduleGroup);

        this.moduleGroupService.update(this.moduleGroupData.id, this.moduleGroupData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Module Group updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmModuleGroup.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateModuleGroup();
        }
        else {
            this.createModuleGroup();
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

    private loadModules() {
        this.listService.getModulePermissionList()
            .subscribe((result: PermissionModule[]) => {
                this.modules = result;
            });
    }
}
