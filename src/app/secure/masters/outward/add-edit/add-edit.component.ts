import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonConstant, CommonUtility, FileUploaderService, PermissionType, UserAuthService } from '@app-core';
import { List, Outward, OutwardProductDetails, InventoryType, FileConfiguration } from '@app-models';
import { OutwardService } from '../outward.service';
import { ListService } from '@app-core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InventoryTypeService } from '../../inventory-type/inventory-type.service';
import { UploadType } from '@app-enums';

@Component({
    templateUrl: './add-edit.component.html',
    providers: [DecimalPipe, DatePipe]
})
export class OutwardAddEditComponent implements OnInit, OnDestroy {
    frmOutward: UntypedFormGroup;
    outwardData: Outward;
    outwardId: number;
    isEditMode: boolean;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.outward;
    permissions = PermissionType;
    error: string;
    customers: any[];
    customerAddresses: any[];
    vendors: any[];
    warehouses: any[];
    inventoryTypes: List[];
    materialRequisitions: List[];
    loggedInUserId: number;

    products: List[];
    uoms: List[] = [];

    showCustomers: boolean = true;
    showVendors: boolean = false;
    showWarehouses: boolean = false;

    fileOptions: FileConfiguration = {
        maxAllowedFile: 1,
        completeCallback: this.uploadCompleted.bind(this),
        onWhenAddingFileFailed: this.uploadFailed.bind(this)
    };

    fileUploader: FileUploaderService = new FileUploaderService(this.fileOptions);

    routerSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private outwardService: OutwardService,
        private notificationService: ToastrService, private listService: ListService,
        private authService: UserAuthService, private datePipe: DatePipe,
        private inventoryTypeService: InventoryTypeService) {
        this.loggedInUserId = this.authService.getBrowserUser().id;
        this.createForm();
    }

    ngOnInit(): void {
        this.getOutwardRoute();
        this.loadDropdowns();

        if (!this.isEditMode) {
            this.generateOutwardCode();
        }
    }

    private createForm() {
        this.frmOutward = this.formBuilder.group({
            outwardCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(32)]],
            outwardDate: [new Date(), [Validators.required]],
            inventoryTypeId: ['', [Validators.required]],
            fromWarehouseId: ['', [Validators.required]],
            customerId: [''],
            vendorId: [''],
            warehouseId: [''],
            materialRequisitionId: [''],
            address: [''],
            billingAddress: [''],
            supportingDocumentId: [''],
            supportingDocumentNo: [''],
            supportingDocumentDate: [''],
            remarks: [''],
            outwardProductDetails: this.formBuilder.array([])
        });
    }

    get outwardProductDetails() {
        return this.frmOutward.get('outwardProductDetails') as UntypedFormArray;
    }

    private getOutwardRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.outwardId = +params["id"];
                this.getOutwardDetails();
            }
        });
    }

    private getOutwardDetails() {
        this.outwardService.getById(this.outwardId)
            .subscribe((result: Outward) => {
                this.outwardData = result;
                this.onInventoryTypeChange(result.inventoryTypeId);
                this.onCustomerChange(result.customerId);
                this.setOutwardData(result);
            },
                (error) => {
                    this.error = error;
                });
    }

    private setOutwardData(outward: Outward) {
        this.frmOutward.patchValue(outward);

        if (outward.outwardProductDetails) {
            outward.outwardProductDetails.forEach((detail) => {
                this.addProductDetail(detail);
            });
        }
    }

    addProductDetail(detail?: OutwardProductDetails) {
        const control = this.outwardProductDetails;
        control.push(this.formBuilder.group({
            id: [detail ? detail.id : 0],
            productId: [detail ? detail.productId : '', [Validators.required]],
            productName: [{ value: detail ? detail.productName : '', disabled: true }],
            productDescription: [detail ? detail.productDescription : '', [Validators.required]],
            quantity: [detail ? detail.quantity : '', [Validators.required, Validators.min(0.01), Validators.max(detail ? detail.remainingQuantity : 1)]],
            uomId: [detail ? detail.uomId : '', [Validators.required]],
            uomName: [{ value: detail ? detail.uomName : '', disabled: true }],
            mrQuantity: [{ value: detail ? detail.mrQuantity : 1, disabled: true }],
            pastIssuedQuantity: [{ value: detail ? detail.pastIssuedQuantity : 0, disabled: true }],
            remainingQuantity: [{ value: detail ? detail.remainingQuantity : 1, disabled: true }],
            stockQuantity: [{ value: detail ? detail.stockQuantity : 0, disabled: true }],
            remarks: [detail ? detail.remarks : '']
        }));
    }

    removeProductDetail(i: number) {
        const control = this.outwardProductDetails;
        control.removeAt(i);
    }

    private loadDropdowns() {
        this.inventoryTypeService.getOutwardInventoryTypes()
            .subscribe((result: List[]) => {
                this.inventoryTypes = result;
            });

        this.listService.getList("warehouses")
            .subscribe((result: any[]) => {
                this.warehouses = result;
            });

        this.listService.getList("products")
            .subscribe((result: any[]) => {
                this.products = result
            });
    }

    onInventoryTypeChange(inventoryTypeId: number) {
        this.inventoryTypeService.getById(inventoryTypeId)
            .subscribe((result: InventoryType) => {
                if (result.applicableToId === CommonConstant.ApplicableTo.Customer) {
                    this.showCustomers = true;
                    this.showVendors = false;
                    this.showWarehouses = false;

                    this.listService.getList("customers")
                        .subscribe((result: any[]) => {
                            this.customers = result;
                        }, (error) => {
                            console.log(error);
                        });
                }
                else if (result.applicableToId === CommonConstant.ApplicableTo.Vendor) {
                    this.showCustomers = false;
                    this.showVendors = true;
                    this.showWarehouses = false;

                    this.listService.getList("vendors")
                        .subscribe((result: any[]) => {
                            this.vendors = result;
                        }, (error) => {
                            console.log(error);
                        });
                }
                else if (result.applicableToId === CommonConstant.ApplicableTo.Warehouse) {
                    this.showCustomers = false;
                    this.showVendors = false;
                    this.showWarehouses = true;
                }
            }, (error) => {
                console.log(error);
            });
    }

    onCustomerChange(customerId: number) {
        this.outwardService.getPendingMaterialRequisitionsByCustomerId(customerId)
            .subscribe((result: List[]) => {
                this.materialRequisitions = result;
            }, (error) => {
                this.materialRequisitions = [];
                console.log(error);
            });
    }

    onMaterialRequisitionChange(materialRequisitionId: number) {
        this.outwardProductDetails.clear();

        // this.materialRequisitionService.getPendingProductDetailsByMaterialRequisitionId(materialRequisitionId)
        //     .subscribe((result: OutwardProductDetails[]) => {
        //         result.forEach((detail) => {
        //             this.addProductDetail(detail);
        //         });
        //     }, (error) => {
        //         console.log(error);
        //     });
    }

    onProductChange(index: number, productId: number) {
        this.outwardService.getProductUOMs(productId).subscribe((result: List) => {
            const control = this.outwardProductDetails.at(index);
            control.get('uomId').setValue(result.id);
            control.get('uomName').setValue(result.name);
        });
    }

    private generateOutwardCode() {
        this.outwardService.generateCode().subscribe((code: string) => {
            this.frmOutward.get('outwardCode').setValue(code);
        });
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    private uploadDocuments(id: number) {
        this.fileUploader.uploadFiles({
            uploadType: UploadType.Outward,
            id: id.toString()
        });
    }

    private uploadCompleted() {
        this.cancel();

        if (this.isEditMode) {
            this.notificationService.success("Outward updated successfully.");
        } else {
            this.notificationService.success("Outward saved successfully.");
        }
    }

    private uploadFailed() {
        this.notificationService.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    onSelectFile(event) {

    }

    removeFile(event) {
        if (this.outwardData) {
            this.outwardData.supportingDocumentId = null;
            this.outwardData.supportingDocument = null;
        }

        this.fileUploader.uploader.clearQueue();
    }

    canHideUploader(): boolean {
        let hideUploader: boolean = false;

        if ((this.outwardData && this.outwardData.supportingDocumentId > 0) || this.fileUploader.hasFile()) {
            hideUploader = true;
        }

        return hideUploader;
    }

    private createOutward(outwardData: Outward) {
        this.outwardService.add(outwardData)
            .subscribe((result) => {
                if (this.fileUploader.hasFile()) {
                    this.uploadDocuments(result.id);
                }
                else {
                    this.cancel();
                    this.notificationService.success("Outward saved successfully.");
                }
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateOutward(outwardData: Outward) {
        this.outwardService.update(this.outwardId, outwardData)
            .subscribe((result) => {
                if (this.fileUploader.hasFile()) {
                    this.uploadDocuments(result.id);
                }
                else {
                    this.cancel();
                    this.notificationService.success("Outward updated successfully.");
                }
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmOutward.invalid) {
            return;
        }

        const outwardData = this.frmOutward.getRawValue();

        if (outwardData.outwardProductDetails.length === 0) {
            this.notificationService.warning("Please add at least one product detail.");
            return;
        }

        outwardData.id = this.outwardId;
        outwardData.outwardDate = this.formatDate(outwardData.outwardDate);
        outwardData.supportingDocumentDate = this.formatDate(outwardData.supportingDocumentDate);

        if (this.isEditMode) {
            this.updateOutward(outwardData);
        } else {
            this.createOutward(outwardData);
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