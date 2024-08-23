import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { GroupCode } from '@app-models';
import { GroupCodeService } from '../group-code.service';

@Component({
    templateUrl: './add-edit.component.html'
})
export class GroupCodeAddEditComponent implements OnInit, OnDestroy {
    groupCodeData: GroupCode;
    groupCodeId: number;
    isEditMode: boolean;
    frmGroupCode: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.group_code;
    permissions = PermissionType;
    error: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
                private formBuilder: UntypedFormBuilder, private groupCodeService: GroupCodeService,
                private notificationService: ToastrService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getGroupCodeRoute();
        if (!this.isEditMode) {
            this.generateCode();
        }
    }

    private getGroupCodeRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.groupCodeId = +params["id"];
                this.getGroupCodeDetails();
            }
        });
    }

    private getGroupCodeDetails() {
        this.groupCodeService.getById(this.groupCodeId)
            .subscribe((result: GroupCode) => {
                this.groupCodeData = result;
                this.setGroupCodeData();
            },
            (error) => {
                console.log(error);
            });
    }

    private setGroupCodeData() {
        this.frmGroupCode.patchValue(this.groupCodeData);
    }

    private generateCode() {
        this.groupCodeService.generateCode()
            .subscribe((code: string) => {
                this.frmGroupCode.patchValue({ code });
            }, (error) => {
                console.log(error);
            });
    }

    createForm() {
        this.frmGroupCode = this.formBuilder.group({
            code: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
            name: ['', [Validators.required, Validators.maxLength(100)]],
            groupName: ['', [Validators.required, Validators.maxLength(100)]],
            priority: ['', [Validators.required, Validators.min(1)]],
            value: ['', [Validators.maxLength(255)]]
        });
    }

    private createGroupCode() {
        let groupCode: GroupCode = this.frmGroupCode.getRawValue();
        this.groupCodeService.add(groupCode)
            .subscribe(() => {
                this.cancel();
                this.notificationService.success("Group Code saved successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    private updateGroupCode() {
        let groupCode: GroupCode = this.frmGroupCode.getRawValue();
        this.groupCodeData = Object.assign(this.groupCodeData, this.groupCodeData, groupCode);

        this.groupCodeService.update(this.groupCodeData.id, this.groupCodeData)
            .subscribe(() => {
                this.cancel();
                this.notificationService.success("Group Code updated successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmGroupCode.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateGroupCode();
        } else {
            this.createGroupCode();
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
