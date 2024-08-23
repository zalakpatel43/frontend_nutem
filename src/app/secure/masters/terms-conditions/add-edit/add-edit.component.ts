import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { TermsAndConditions, GroupCode, List } from '@app-models';  // Adjust the import path as necessary
import { TermsAndConditionsService } from '../terms-conditions.service';

@Component({
    templateUrl: './add-edit.component.html'
})
export class TermsAndConditionsAddEditComponent implements OnInit, OnDestroy {
    termsAndConditionsData: TermsAndConditions;
    termsAndConditionsId: number;
    isEditMode: boolean;
    frmTermsAndConditions: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.termsAndConditions;
    permissions = PermissionType;
    error: string;
    types: List[] = [];
    categories: List[] = [];

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private termsAndConditionsService: TermsAndConditionsService,
        private notificationService: ToastrService, private listService: ListService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getTermsAndConditionsRoute();
        this.loadTypes();
        this.loadCategories();
    }

    private getTermsAndConditionsRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.termsAndConditionsId = +params["id"];
                this.getTermsAndConditionsDetails();
            }
        });
    }

    private getTermsAndConditionsDetails() {
        this.termsAndConditionsService.getById(this.termsAndConditionsId)
            .subscribe((result: TermsAndConditions) => {
                this.termsAndConditionsData = result;
                this.setTermsAndConditionsData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setTermsAndConditionsData() {
        this.frmTermsAndConditions.patchValue(this.termsAndConditionsData);
    }

    private createForm() {
        this.frmTermsAndConditions = this.formBuilder.group({
            code: ['', [Validators.required, Validators.maxLength(128)]],
            name: ['', [Validators.required, Validators.maxLength(256)]],
            description: ['', [Validators.required, Validators.maxLength(2048)]],
            priority: [null, [Validators.required]],
            allowToChange: [false],
            typeId: [null, [Validators.required]],
            categoryId: [null],
            createdBy: [null],
            createdOn: [null],
            modifiedBy: [null],
            modifiedOn: [null]
        });
    }

    private createTermsAndConditions() {
        let termsAndConditions: TermsAndConditions = this.frmTermsAndConditions.value;
        this.termsAndConditionsService.add(termsAndConditions)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Terms and Conditions saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateTermsAndConditions() {
        let termsAndConditions: TermsAndConditions = this.frmTermsAndConditions.value;
        this.termsAndConditionsData = Object.assign(this.termsAndConditionsData, this.termsAndConditionsData, termsAndConditions);

        this.termsAndConditionsService.update(this.termsAndConditionsData.id, this.termsAndConditionsData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Terms and Conditions updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmTermsAndConditions.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateTermsAndConditions();
        }
        else {
            this.createTermsAndConditions();
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

    private loadTypes() {
        this.listService.getList("types")
            .subscribe((result: List[]) => {
                this.types = result;
            });
    }

    private loadCategories() {
        this.listService.getList("categories")
            .subscribe((result: List[]) => {
                this.categories = result;
            });
    }
}
