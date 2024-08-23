import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonConstant, CommonUtility, FileUploaderService, PermissionType, UserAuthService } from '@app-core';
import { List, Inward, InwardProductDetails, InventoryType, FileConfiguration } from '@app-models';
import { InwardService } from '../inward.service';
import { ListService } from '@app-core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InventoryTypeService } from '../../inventory-type/inventory-type.service';
import { UploadType } from '@app-enums';
import { PurchaseOrderService } from '../../purchase-order/purchase-order.service';

@Component({
    templateUrl: './add-edit.component.html',
    providers: [DecimalPipe, DatePipe]
})
export class InwardAddEditComponent implements OnInit, OnDestroy {
    frmInward: UntypedFormGroup;
    inwardData: Inward;
    inwardId: number;
    isEditMode: boolean;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.inward;
    permissions = PermissionType;
    error: string;
    customers: any[];
    customerAddresses: any[];
    vendors: any[];
    warehouses: any[];
    inventoryTypes: List[];
    purchaseOrders: List[];
    loggedInUserId: number;

    showCustomers: boolean = false;
    showVendors: boolean = true;
    showWarehouses: boolean = false;

    fileOptions: FileConfiguration = {
        maxAllowedFile: 1,
        completeCallback: this.uploadCompleted.bind(this),
        onWhenAddingFileFailed: this.uploadFailed.bind(this)
    };

    fileUploader: FileUploaderService = new FileUploaderService(this.fileOptions);

    routerSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private inwardService: InwardService,
        private notificationService: ToastrService, private listService: ListService,
        private authService: UserAuthService, private datePipe: DatePipe,
        private inventoryTypeService: InventoryTypeService,
        private purchaseOrderService: PurchaseOrderService) {
        this.loggedInUserId = this.authService.getBrowserUser().id;
        this.createForm();
    }

    ngOnInit(): void {
        this.getInwardRoute();
        this.loadDropdowns();
        if (!this.isEditMode) {
            this.generateInwardCode();
        }
    }

    private createForm() {
        this.frmInward = this.formBuilder.group({
            inwardCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(32)]],
            inwardDate: [new Date(), [Validators.required]],
            inventoryTypeId: ['', [Validators.required]],
            fromWarehouseId: ['', [Validators.required]],
            customerId: [''],
            vendorId: [''],
            warehouseId: [''],
            purchaseOrderId: [''],
            supportingDocumentId: [''],
            supportingDocumentNo: [''],
            supportingDocumentDate: [''],
            remarks: [''],
            inwardProductDetails: this.formBuilder.array([])
        });
    }

    get inwardProductDetails() {
        return this.frmInward.get('inwardProductDetails') as UntypedFormArray;
    }

    private getInwardRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.inwardId = +params["id"];
                this.getInwardDetails();
            }
        });
    }

    private getInwardDetails() {
        this.inwardService.getById(this.inwardId)
            .subscribe((result: Inward) => {
                this.inwardData = result;
                this.onInventoryTypeChange(result.inventoryTypeId);
                this.onVendorChange(result.vendorId);
                this.setInwardData(result);
            },
                (error) => {
                    this.error = error;
                });
    }

    private setInwardData(inward: Inward) {
        this.frmInward.patchValue(inward);

        if (inward.inwardProductDetails) {
            inward.inwardProductDetails.forEach((detail) => {
                this.addProductDetail(detail);
            });
        }
    }

    addProductDetail(detail?: InwardProductDetails) {
        const control = this.inwardProductDetails;
        control.push(this.formBuilder.group({
            id: [detail ? detail.id : 0],
            productId: [detail ? detail.productId : '', [Validators.required]],
            productName: [{ value: detail ? detail.productName : '', disabled: true }],
            productDescription: [detail ? detail.productDescription : '', [Validators.required]],
            quantity: [detail ? detail.quantity : '', [Validators.required, Validators.min(0.01), Validators.max(detail ? detail.remainingQuantity : 0.01)]],
            uomId: [detail ? detail.uomId : '', [Validators.required]],
            uomName: [{ value: detail ? detail.uomName : '', disabled: true }],
            poQuantity: [{ value: detail ? detail.poQuantity : '', disabled: true }],
            pastReceivedQuantity: [{ value: detail ? detail.pastReceivedQuantity : '', disabled: true }],
            remainingQuantity: [{ value: detail ? detail.remainingQuantity : '', disabled: true }],
            remarks: [detail ? detail.remarks : '']
        }));
    }

    removeProductDetail(i: number) {
        const control = this.inwardProductDetails;
        control.removeAt(i);
    }

    private loadDropdowns() {
        this.inventoryTypeService.getInwardInventoryTypes()
            .subscribe((result: List[]) => {
                this.inventoryTypes = result;
            });

        this.listService.getList("warehouses")
            .subscribe((result: any[]) => {
                this.warehouses = result;
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

    onVendorChange(vendorId: number) {
        this.purchaseOrderService.getPendingPurchaseOrdersByVendorId(vendorId)
            .subscribe((result: List[]) => {
                this.purchaseOrders = result;
            }, (error) => {
                this.purchaseOrders = [];
                console.log(error);
            });
    }

    onPurchaseOrderChange(purchaseOrderId: number) {
        this.inwardProductDetails.clear();

        this.purchaseOrderService.getPendingProductDetailsByPurchaseOrderId(purchaseOrderId)
            .subscribe((result: InwardProductDetails[]) => {
                result.forEach((detail) => {
                    this.addProductDetail(detail);
                });

            }, (error) => {
                console.log(error);
            });
    }

    onProductChange(index: number, productId: number) {
        this.inwardService.getProductUOMs(productId).subscribe((result: List) => {
            const control = this.inwardProductDetails.at(index);
            control.get('uomId').setValue(result.id);
            control.get('uomName').setValue(result.name);
        });
    }

    private generateInwardCode() {
        this.inwardService.generateCode().subscribe((code: string) => {
            this.frmInward.get('inwardCode').setValue(code);
        });
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    private uploadDocuments(id: number) {
        this.fileUploader.uploadFiles({
            uploadType: UploadType.Inward,
            id: id.toString()
        });
    }

    private uploadCompleted() {
        this.cancel();

        if (this.isEditMode) {
            this.notificationService.success("Inward updated successfully.");
        } else {
            this.notificationService.success("Inward saved successfully.");
        }
    }

    private uploadFailed() {
        this.notificationService.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    onSelectFile(event) {

    }

    removeFile(event) {
        if (this.inwardData) {
            this.inwardData.supportingDocumentId = null;
            this.inwardData.supportingDocument = null;
            this.frmInward.controls['supportingDocumentId'].setValue(null);
        }

        this.fileUploader.uploader.clearQueue();
    }

    canHideUploader(): boolean {
        let hideUploader: boolean = false;

        if ((this.inwardData && this.inwardData.supportingDocumentId > 0) || this.fileUploader.hasFile()) {
            hideUploader = true;
        }

        return hideUploader;
    }

    private createInward(inwardData: Inward) {
        this.inwardService.add(inwardData)
            .subscribe((result) => {
                if (this.fileUploader.hasFile()) {
                    this.uploadDocuments(result.id);
                }
                else {
                    this.cancel();
                    this.notificationService.success("Inward saved successfully.");
                }
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateInward(inwardData: Inward) {
        this.inwardService.update(this.inwardId, inwardData)
            .subscribe((result) => {
                if (this.fileUploader.hasFile()) {
                    this.uploadDocuments(result.id);
                }
                else {
                    this.cancel();
                    this.notificationService.success("Inward updated successfully.");
                }
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmInward.invalid) {
            return;
        }

        const inwardData = this.frmInward.getRawValue();

        if (inwardData.inwardProductDetails.length === 0) {
            this.notificationService.warning("Please add at least one product detail.");
            return;
        }

        inwardData.id = this.inwardId;
        inwardData.inwardDate = this.formatDate(inwardData.inwardDate);
        inwardData.supportingDocumentDate = this.formatDate(inwardData.supportingDocumentDate);

        if (this.isEditMode) {
            this.updateInward(inwardData);
        } else {
            this.createInward(inwardData);
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