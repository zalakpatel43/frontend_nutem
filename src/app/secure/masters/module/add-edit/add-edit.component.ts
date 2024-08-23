import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Module } from '@app-models';
import { ModuleService } from '../module.service';

@Component({
    templateUrl: './add-edit.component.html'
})

export class ModuleAddEditComponent implements OnInit, OnDestroy {
    moduleData: Module;
    moduleId: number;
    isEditMode: boolean;
    frmModule: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.module;
    permissions = PermissionType;
    error: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private moduleService: ModuleService,
        private notificationService: ToastrService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getModuleRoute();
    }

    private getModuleRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.moduleId = +params["id"];
                this.getModuleDetails();
            }
        });
    }

    private getModuleDetails() {
        this.moduleService.getById(this.moduleId)
            .subscribe((result: Module) => {
                this.moduleData = result;
                this.setModuleData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setModuleData() {
        this.frmModule.patchValue(this.moduleData);
    }

    createForm() {
        this.frmModule = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            code: ['', [Validators.required, Validators.maxLength(50)]],
            priority: ['', [Validators.required, Validators.min(1)]]
        });
    }

    private createModule() {
        let module: Module = this.frmModule.value;
        this.moduleService.add(module)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Module saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateModule() {
        let module: Module = this.frmModule.value;
        this.moduleData = Object.assign(this.moduleData, this.moduleData, module);

        this.moduleService.update(this.moduleData.id, this.moduleData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Module updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmModule.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateModule();
        } else {
            this.createModule();
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
        this.routerSub.unsubscribe();
    }
}
