import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { BOMMaster } from '@app-models';
import { BOMService } from '../bom.service';

@Component({
    templateUrl: './add-edit.component.html'
})
export class BOMAddEditComponent implements OnInit, OnDestroy {
    bomData: BOMMaster;
    bomId: number;
    isEditMode: boolean;
    frmBOM: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.bom;
    permissions = PermissionType;
    error: string;

    constructor(
        private activatedRoute: ActivatedRoute, 
        private router: Router,
        private formBuilder: UntypedFormBuilder, 
        private bomService: BOMService,
        private notificationService: ToastrService
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getBOMRoute();
    }

    private getBOMRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.bomId = +params["id"];
                this.getBOMDetails();
            }
        });
    }

    private getBOMDetails() {
        this.bomService.getById(this.bomId)
            .subscribe((result: BOMMaster) => {
                this.bomData = result;
                this.setBOMData();
            },
            (error) => {
                console.log(error);
            });
    }

    private setBOMData() {
        this.frmBOM.patchValue(this.bomData);
        this.setBOMDetails(this.bomData.details);
    }

    private setBOMDetails(details: any[]) {
        const detailsFormArray = this.frmBOM.get('details') as UntypedFormArray;
        details.forEach(detail => {
            detailsFormArray.push(this.formBuilder.group({
                rawProductCode: [detail.rawProductCode, [Validators.required, Validators.maxLength(50)]],
                componentCode: [detail.componentCode, [Validators.required, Validators.maxLength(50)]],
                qty: [detail.qty, [Validators.required]],
                uom: [detail.uom, [Validators.required, Validators.maxLength(20)]]
            }));
        });
    }

    createForm() {
        this.frmBOM = this.formBuilder.group({
            bomCode: ['', [Validators.required, Validators.maxLength(50)]],
            bomName: ['', [Validators.required, Validators.maxLength(100)]],
            finishedProduct: ['', [Validators.required, Validators.maxLength(100)]],
            baseQty: ['', [Validators.required]],
            remarks: ['', [Validators.maxLength(255)]],
            details: this.formBuilder.array([])
        });
    }

    get details(): UntypedFormArray {
        return this.frmBOM.get('details') as UntypedFormArray;
    }

    addDetail() {
        const detailForm = this.formBuilder.group({
            rawProductCode: ['', [Validators.required, Validators.maxLength(50)]],
            componentCode: ['', [Validators.required, Validators.maxLength(50)]],
            qty: ['', [Validators.required]],
            uom: ['', [Validators.required, Validators.maxLength(20)]]
        });
        this.details.push(detailForm);
    }

    removeDetail(index: number) {
        this.details.removeAt(index);
    }

    private createBOM() {
        const bom: BOMMaster = this.frmBOM.value;
        this.bomService.add(bom)
            .subscribe(() => {
                this.cancel();
                this.notificationService.success("BOM saved successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    private updateBOM() {
        const bom: BOMMaster = this.frmBOM.value;
        this.bomData = Object.assign(this.bomData, this.bomData, bom);

        this.bomService.update(this.bomData.id, this.bomData)
            .subscribe(() => {
                this.cancel();
                this.notificationService.success("BOM updated successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmBOM.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateBOM();
        } else {
            this.createBOM();
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
