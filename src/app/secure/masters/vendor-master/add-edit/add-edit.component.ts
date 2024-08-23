import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VendorMaster, VendorContactInformation, VendorAddressInformation, VendorDocuments, VendorProductCategories, List, FileConfiguration } from '@app-models';
import { VendorMasterService } from '../vendor-master.service';
import { ApplicationPage, CommonUtility, FileUploaderService, ListService, PermissionType } from '@app-core';
import { TermsAndConditionsService } from '../../terms-conditions/terms-conditions.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePreviewModalComponent } from 'src/app/shared/components/file-preview-modal/file-preview-modal.component';
import { UploadType } from '@app-enums';

@Component({
    selector: 'app-vendor-master-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class VendorMasterAddEditComponent implements OnInit, OnDestroy {
    vendorMasterData: VendorMaster
    vendorMasterId: number;
    vendorMasterForm: UntypedFormGroup;
    routerSub: Subscription;
    isEditMode: boolean = false;
    isFormSubmitted: boolean = false;
    page: string = ApplicationPage.vendorMaster;
    permissions = PermissionType;
    error: string;

    fileUploader: FileUploaderService;
    uploadDocuments: VendorDocuments[] = [];
    uploadedCount: number = 0;

    filePreviewModalRef: BsModalRef;

    // Dropdown data
    termsConditionsList = [];
    statesList = [];
    countriesList = [];
    productCategoriesList = [];

    constructor(private fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
        private vendorMasterService: VendorMasterService, private listService: ListService,
        private toastr: ToastrService, private termsAndConditionsService: TermsAndConditionsService,
        private modalService: BsModalService
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.loadDropdowns();
        this.getVendorMasterRoute();
    }

    createForm(): void {
        this.vendorMasterForm = this.fb.group({
            vendorCode: [{ value: '', disabled: true }, [Validators.required]],
            vendorName: ['', [Validators.required, Validators.maxLength(256)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
            phone: ['', [Validators.required, Validators.maxLength(32)]],
            mobile: ['', [Validators.required, Validators.maxLength(32)]],
            baseAddress1: ['', [Validators.required, Validators.maxLength(128)]],
            baseAddress2: ['', Validators.maxLength(128)],
            city: ['', [Validators.required, Validators.maxLength(128)]],
            stateId: [null, Validators.required],
            countryId: [null, Validators.required],
            zipCode: ['', [Validators.required, Validators.maxLength(32)]],
            gstNumber: ['', [Validators.required, Validators.maxLength(64)]],
            termsConditionsId: [null, Validators.required],
            isActive: [true],
            vendorContactInformations: this.fb.array([]),
            vendorAddressInformations: this.fb.array([]),
            vendorDocuments: this.fb.array([]),
            vendorProductCategories: this.fb.array([])
        });
    }

    getVendorMasterRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.vendorMasterId = +params['id'];
                this.getVendorMasterDetails(this.vendorMasterId);
            }
            else {
                this.generateVendorCode();
            }
        });
    }

    get vendorContactInformations(): UntypedFormArray {
        return this.vendorMasterForm.get('vendorContactInformations') as UntypedFormArray;
    }

    get vendorAddressInformations(): UntypedFormArray {
        return this.vendorMasterForm.get('vendorAddressInformations') as UntypedFormArray;
    }

    get vendorDocuments(): UntypedFormArray {
        return this.vendorMasterForm.get('vendorDocuments') as UntypedFormArray;
    }

    get vendorProductCategories(): UntypedFormArray {
        return this.vendorMasterForm.get('vendorProductCategories') as UntypedFormArray;
    }

    addVendorContactInformation(contact?: VendorContactInformation) {
        this.vendorContactInformations.push(this.fb.group({
            id: [contact ? contact.id : 0],
            firstName: [contact ? contact.firstName : '', [Validators.required, Validators.maxLength(128)]],
            lastName: [contact ? contact.lastName : '', [Validators.required, Validators.maxLength(128)]],
            mobileNo: [contact ? contact.mobileNo : '', Validators.maxLength(128)],
            landlineNo: [contact ? contact.landlineNo : '', Validators.maxLength(128)],
            email: [contact ? contact.email : '', [Validators.required, Validators.email, Validators.maxLength(128)]],
            address1: [contact ? contact.address1 : '', [Validators.required, Validators.maxLength(128)]],
            address2: [contact ? contact.address2 : '', Validators.maxLength(128)],
            city: [contact ? contact.city : '', [Validators.required, Validators.maxLength(128)]],
            stateId: [contact ? contact.stateId : null, Validators.required],
            countryId: [contact ? contact.countryId : null, Validators.required],
            department: [contact ? contact.department : '', [Validators.required, Validators.maxLength(128)]],
            designation: [contact ? contact.designation : '', [Validators.required, Validators.maxLength(128)]],
            reportingTo: [contact ? contact.reportingTo : '', Validators.maxLength(128)]
        }));
    }

    addVendorAddressInformation(address?: VendorAddressInformation) {
        this.vendorAddressInformations.push(this.fb.group({
            id: [address ? address.id : 0],
            location: [address ? address.location : '', [Validators.required, Validators.maxLength(256)]],
            mobileNo: [address ? address.mobileNo : '', [Validators.required, Validators.maxLength(128)]],
            landlineNo: [address ? address.landlineNo : '', [Validators.required, Validators.maxLength(128)]],
            email: [address ? address.email : '', [Validators.required, Validators.email, Validators.maxLength(256)]],
            address1: [address ? address.address1 : '', [Validators.required, Validators.maxLength(128)]],
            address2: [address ? address.address2 : '', Validators.maxLength(128)],
            city: [address ? address.city : '', [Validators.required, Validators.maxLength(128)]],
            stateId: [address ? address.stateId : null, Validators.required],
            countryId: [address ? address.countryId : null, Validators.required],
            gstNo: [address ? address.gstNo : '', [Validators.required, Validators.maxLength(128)]]
        }));
    }

    addVendorDocument(document?: VendorDocuments) {
        let exists: boolean = true;

        if (!document) {
            exists = false;

            document = new VendorDocuments();
            document.pictureId = null;
            document.picture = null;
            document.documentName = '';
            document.hideUploader = false;
            document.uniqueId = CommonUtility.generateUUID();
            document.uploader = new FileUploaderService({
                maxAllowedFile: 1,
                completeCallback: this.uploadCompleted.bind(this, document),
                onWhenAddingFileFailed: this.uploadFailed.bind(this)
            });
        }

        this.vendorDocuments.push(this.fb.group({
            documentName: [document ? document.documentName : '', [Validators.required, Validators.maxLength(256)]],
            pictureId: [document ? document.pictureId : null],
            uniqueId: [document ? document.uniqueId : null]
        }));

        if (CommonUtility.isEmpty(this.vendorMasterData)) {
            this.vendorMasterData = new VendorMaster();
        }

        if (!exists) {
            this.vendorMasterData.vendorDocuments.push(document);
        }
    }

    addVendorProductCategory(category?: VendorProductCategories): void {
        this.vendorProductCategories.push(this.fb.group({
            id: [category ? category.id : 0],
            productCategoryId: [category ? category.productCategoryId : null, Validators.required],
            expectedDeliveryDays: [category ? category.expectedDeliveryDays : null, Validators.required]
        }));
    }

    removeVendorContactInformation(index: number) {
        this.vendorContactInformations.removeAt(index);
    }

    removeVendorAddressInformation(index: number) {
        this.vendorAddressInformations.removeAt(index);
    }

    removeVendorDocument(index: number) {
        this.vendorDocuments.removeAt(index);
        this.vendorMasterData.vendorDocuments.splice(index, 1);
    }

    removeVendorProductCategory(index: number) {
        this.vendorProductCategories.removeAt(index);
    }

    private generateVendorCode() {
        this.vendorMasterService.generateVendorCode()
            .subscribe((code: string) => {
                this.vendorMasterForm.patchValue({ vendorCode: code });
            }, (error) => {
                console.log(error);
            });
    }

    loadDropdowns(): void {
        this.termsAndConditionsService.getTermsAndConditionsList()
            .subscribe((result: List[]) => {
                this.termsConditionsList = result;
            });

        this.listService.getList("productcategories")
            .subscribe((result: List[]) => {
                this.productCategoriesList = result;
            });

        this.listService.getAllStates()
            .subscribe((data) => {
                this.statesList = data
            });

        this.listService.getCountries()
            .subscribe((data) => {
                this.countriesList = data
            });
    }

    getVendorMasterDetails(id: number): void {
        this.vendorMasterService.getById(id).subscribe((data: VendorMaster) => {
            this.vendorMasterData = data;

            if (CommonUtility.isNotEmpty(this.vendorMasterData.vendorDocuments)) {
                this.vendorMasterData.vendorDocuments.forEach((document) => {
                    document.hideUploader = document.pictureId > 0;
                    document.uniqueId = CommonUtility.generateUUID();
                    document.uploader = new FileUploaderService({
                        maxAllowedFile: 1,
                        completeCallback: this.uploadCompleted.bind(this, document),
                        onWhenAddingFileFailed: this.uploadFailed.bind(this)
                    });
                });
            }

            this.setVendorData();
        });
    }

    private setVendorData() {
        this.vendorMasterForm.patchValue(this.vendorMasterData);
        this.vendorMasterData.vendorContactInformations.forEach(contact => this.addVendorContactInformation(contact));
        this.vendorMasterData.vendorAddressInformations.forEach(address => this.addVendorAddressInformation(address));
        this.vendorMasterData.vendorDocuments.forEach((document) => this.addVendorDocument(document));
        this.vendorMasterData.vendorProductCategories.forEach(category => this.addVendorProductCategory(category));
    }

    private createVendor() {
        let vendor: VendorMaster = this.vendorMasterForm.getRawValue();
        this.vendorMasterData = Object.assign(this.vendorMasterData, this.vendorMasterData, vendor);

        this.vendorMasterService.add(vendor)
            .subscribe(() => {
                this.cancel();
                this.toastr.success("Vendor details added successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateVendor() {
        let vendor: VendorMaster = this.vendorMasterForm.getRawValue();
        this.vendorMasterData = Object.assign(this.vendorMasterData, this.vendorMasterData, vendor);

        this.vendorMasterService.update(this.vendorMasterData.id, this.vendorMasterData)
            .subscribe(() => {
                this.cancel();
                this.toastr.success("Vendor details updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.vendorMasterForm.invalid) {
            return;
        }

        if (this.vendorMasterData.vendorDocuments.some(d => !d.pictureId && !d.uploader.hasFile())) {
            this.toastr.warning("Please upload all the required documents.");
            return;
        }

        this.uploadDocuments = this.vendorMasterData.vendorDocuments.filter(d => d.uploader.hasFile());
        this.uploadedCount = 0;

        if (this.uploadDocuments.length > 0) {
            this.uploadDocuments.forEach((document, index) => {
                if (document.uploader.hasFile()) {
                    document.uploader.uploadFiles({
                        uploadType: UploadType.Vendor,
                        id: `0`
                    });
                }
            });
        }
        else {
            if (this.isEditMode) {
                this.updateVendor();
            } else {
                this.createVendor();
            }
        }
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    hasFile(item: VendorDocuments) {
        return ((this.isEditMode && CommonUtility.isNotEmpty(item.picture)) || item.uploader.hasFile());
    }

    private uploadCompleted(item: any, response: any) {
        this.uploadedCount++;

        const docControl = this.vendorDocuments.controls.find(c => c.get('uniqueId').value === item.uniqueId);
        if (docControl) {
            docControl.get('pictureId').setValue(response.id);
        }

        if (this.uploadedCount === this.uploadDocuments.length) {
            if (this.isEditMode) {
                this.updateVendor();
            } else {
                this.createVendor();
            }
        }
    }

    private uploadFailed() {
        this.toastr.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    selectedFile(item: VendorDocuments) {
        item.hideUploader = true;
    }

    removeEditFile(item: VendorDocuments) {
        item.pictureId = null;
        item.picture = null;
        item.hideUploader = false;
        item.uploader.uploader.clearQueue();
    }

    filePreview(file, type, title) {
        this.filePreviewModalRef = this.modalService.show(FilePreviewModalComponent, { class: 'modal-lg modal-tr' });
        this.filePreviewModalRef.content.setData({ file, type, title });
    }

    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }
}