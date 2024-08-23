import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Company, FileConfiguration } from '@app-models';
import { ApplicationPage, CommonUtility, FileUploaderService, PermissionType } from '@app-core';
import { ValidationService } from '@app-shared';
import { CompanyService } from '../company.service';
import { UploadType } from '@app-enums';

@Component({
    templateUrl: './add-edit.component.html'
})

export class CompanyAddEditComponent implements OnInit, OnDestroy {

    companyData: Company;
    companyId: number;
    isEditMode: boolean;
    frmCompany: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    error: string;
    page: string = ApplicationPage.company;
    permissions = PermissionType;

    fileOptions: FileConfiguration = {
        maxAllowedFile: 1,
        completeCallback: this.uploadCompleted.bind(this),
        onWhenAddingFileFailed: this.uploadFailed.bind(this)
    };

    fileUploader: FileUploaderService = new FileUploaderService(this.fileOptions);

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private companyService: CompanyService,
        private notificationService: ToastrService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getCompanyRoute();
    }

    private getCompanyRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.companyId = +params["id"];
                this.getCompanyDetails();
            }
            else {
                this.companyData = new Company();
            }
        });
    }

    private getCompanyDetails() {
        this.companyService.getById(this.companyId)
            .subscribe((result: Company) => {
                this.companyData = result;
                this.setCompanyData();
            }, (error) => {
                console.log(error);
            });
    }

    private setCompanyData() {
        this.frmCompany.patchValue(this.companyData);
    }

    createForm() {
        this.frmCompany = this.formBuilder.group({
            // Assuming these are the fields required for a company entity.
            // Include validators as per your validation rules.
            companyName: ['', [Validators.required, Validators.maxLength(100)]],
            alias: [''],
            address1: ['', [Validators.required]],
            address2: [''],
            address3: [''],
            pincode: ['', [Validators.required, Validators.maxLength(10)]],
            city: ['', [Validators.required, Validators.maxLength(50)]],
            state: ['', [Validators.required, Validators.maxLength(50)]],
            country: ['', [Validators.required, Validators.maxLength(50)]],
            panNo: [''],
            gstNo: [''],
            emailID: ['', [Validators.email, Validators.maxLength(50)]],
            website: [''],
            phoneNo: ['', [Validators.maxLength(15)]],
            isActive: [false],
            companyLogoId: [''],
            currency: ['']
            // Add more form controls here if needed
        });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmCompany.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateCompany();
        } else {
            this.createCompany();
        }
    }

    removeFile(event) {
        if (this.companyData) {
            this.companyData.companyLogoId = null;
            this.companyData.companyLogo = null;
            this.frmCompany.controls['companyLogoId'].setValue(null);
        }

        this.fileUploader.uploader.clearQueue();
    }

    canHideUploader(): boolean {
        let hideUploader: boolean = false;

        if ((this.companyData && this.companyData.companyLogoId > 0) || this.fileUploader.hasFile()) {
            hideUploader = true;
        }

        return hideUploader;
    }

    private createCompany() {
        let company: Company = Object.assign({}, this.frmCompany.value);

        this.companyService.add(company)
            .subscribe((result: any) => {
                if (result.isSuccess) {
                    if (this.fileUploader.hasFile()) {
                        this.uploadDocuments(result.id);
                    }
                    else {
                        this.cancel();
                        this.notificationService.success("Company saved successfully.");
                    }
                }
                else {
                    this.notificationService.warning(result.message);
                }
            }, (error) => {
                if (error.status === 400 && error.error.modelState) {
                    this.error = error.error.modelState[''][0];
                } else {
                    this.error = 'Something went wrong';
                }
            });
    }

    private updateCompany() {
        let company: Company = Object.assign(this.companyData, this.frmCompany.value);

        this.companyService.update(this.companyId, company)
            .subscribe((result: any) => {
                if (result.isSuccess) {
                    if (this.fileUploader.hasFile()) {
                        this.uploadDocuments(result.id);
                    }
                    else {
                        this.cancel();
                        this.notificationService.success("Company updated successfully.");
                    }
                }
                else {
                    this.notificationService.warning(result.message);
                }
            }, (error) => {
                if (error.status === 400 && error.error.modelState) {
                    this.error = error.error.modelState[''][0];
                } else {
                    this.error = 'Something went wrong';
                }
            });
    }

    private uploadDocuments(id: number) {
        this.fileUploader.uploadFiles({
            uploadType: UploadType.Company,
            id: id.toString()
        });
    }

    private uploadCompleted() {
        this.cancel();

        if (this.isEditMode) {
            this.notificationService.success("Company updated successfully.");
        } else {
            this.notificationService.success("Company saved successfully.");
        }
    }

    private uploadFailed() {
        this.notificationService.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    onSelectFile(event) {

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
