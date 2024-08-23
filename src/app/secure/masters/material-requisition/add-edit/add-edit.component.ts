import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType, UserAuthService } from '@app-core';
import { List, MaterialRequisition, MaterialRequisitionProductDetails, Customer } from '@app-models';
import { MaterialRequisitionService } from '../material-requisition.service';
import { ListService } from '@app-core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CustomerService } from '../../customer/customer.service';

@Component({
    templateUrl: './add-edit.component.html',
    providers: [DecimalPipe, DatePipe]
})
export class MaterialRequisitionAddEditComponent implements OnInit, OnDestroy {
    frmMaterialRequisition: UntypedFormGroup;
    materialRequisitionData: MaterialRequisition;
    materialRequisitionId: number;
    isEditMode: boolean;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.materialRequisition;
    permissions = PermissionType;
    error: string;
    customers: List[];
    shippingAddresses: any[];
    billingAddresses: any[];
    warehouses: any[];
    loggedInUserId: number;
    products: List[];
    uoms: List[] = [];

    routerSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private materialRequisitionService: MaterialRequisitionService,
        private notificationService: ToastrService, private listService: ListService,
        private authService: UserAuthService, private datePipe: DatePipe,
        private customerService: CustomerService) {
        this.loggedInUserId = this.authService.getBrowserUser().id;
        this.createForm();
    }

    ngOnInit(): void {
        this.getMaterialRequisitionRoute();
        this.loadDropdowns();

        if (!this.isEditMode) {
            this.generateMaterialRequisitionCode();
        }
    }

    private createForm() {
        this.frmMaterialRequisition = this.formBuilder.group({
            materialRequisitionCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(32)]],
            materialRequisitionDate: [new Date(), [Validators.required]],
            warehouseId: ['', [Validators.required]],
            expectedDate: [new Date(), [Validators.required]],
            customerId: [''],
            shippingAddressId: [''],
            billingAddressId: [''],
            remarks: [''],
            materialRequisitionProductDetails: this.formBuilder.array([])
        });
    }

    get materialRequisitionProductDetails() {
        return this.frmMaterialRequisition.get('materialRequisitionProductDetails') as UntypedFormArray;
    }

    private getMaterialRequisitionRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.materialRequisitionId = +params["id"];
                this.getMaterialRequisitionDetails();
            }
        });
    }

    private getMaterialRequisitionDetails() {
        this.materialRequisitionService.getById(this.materialRequisitionId)
            .subscribe((result: MaterialRequisition) => {
                this.materialRequisitionData = result;
                this.onCustomerChange(result.customerId);
                this.setMaterialRequisitionData(result);
            },
                (error) => {
                    this.error = error;
                });
    }

    private setMaterialRequisitionData(materialRequisition: MaterialRequisition) {
        this.frmMaterialRequisition.patchValue(materialRequisition);

        if (materialRequisition.materialRequisitionProductDetails) {
            materialRequisition.materialRequisitionProductDetails.forEach((detail) => {
                this.addProductDetail(detail);
            });
        }
    }

    addProductDetail(detail?: MaterialRequisitionProductDetails) {
        const control = this.materialRequisitionProductDetails;
        control.push(this.formBuilder.group({
            id: [detail ? detail.id : 0],
            productId: [detail ? detail.productId : '', [Validators.required]],
            productDescription: [detail ? detail.productDescription : '', [Validators.required]],
            quantity: [detail ? detail.quantity : '', [Validators.required, Validators.min(0.01)]],
            uomId: [detail ? detail.uomId : '', [Validators.required]],
            uomName: [{ value: detail ? detail.uomName : '', disabled: true }]
        }));
    }

    removeProductDetail(i: number) {
        const control = this.materialRequisitionProductDetails;
        control.removeAt(i);
    }

    private loadDropdowns() {
        this.listService.getList("warehouses")
            .subscribe((result: List[]) => {
                this.warehouses = result;
            });

        this.listService.getList("customers")
            .subscribe((result: List[]) => {
                this.customers = result;
            });

        this.listService.getList("products")
            .subscribe((result: List[]) => {
                this.products = result;
            });
    }

    onCustomerChange(customerId: number) {
        this.customerService.getById(customerId)
            .subscribe((customer: Customer) => {
                if (CommonUtility.isNotEmpty(customer) && customer.customerDetails?.length > 0) {
                    this.shippingAddresses = customer.customerDetails.map((detail) => {
                        return {
                            id: detail.id,
                            name: detail.street + ', ' + detail.city + ', ' + detail.state + ', ' + detail.country + ', ' + detail.zipCode
                        }
                    });

                    this.billingAddresses = customer.customerDetails.map((detail) => {
                        return {
                            id: detail.id,
                            name: detail.street + ', ' + detail.city + ', ' + detail.state + ', ' + detail.country + ', ' + detail.zipCode
                        }
                    });
                }
            }, (error) => {
                this.shippingAddresses = [];
                this.billingAddresses = [];
                console.log(error);
            });
    }

    onProductChange(index: number, productId: number) {
        this.materialRequisitionService.getProductUOMs(productId).subscribe((result: List) => {
            const control = this.materialRequisitionProductDetails.at(index);
            control.get('uomId').setValue(result.id);
            control.get('uomName').setValue(result.name);
        });
    }

    private generateMaterialRequisitionCode() {
        this.materialRequisitionService.generateCode().subscribe((code: string) => {
            this.frmMaterialRequisition.get('materialRequisitionCode').setValue(code);
        });
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    private createMaterialRequisition(materialRequisitionData: MaterialRequisition) {
        this.materialRequisitionService.add(materialRequisitionData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Material Requisition saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateMaterialRequisition(materialRequisitionData: MaterialRequisition) {
        this.materialRequisitionService.update(this.materialRequisitionId, materialRequisitionData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Material Requisition updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmMaterialRequisition.invalid) {
            return;
        }

        const materialRequisitionData = this.frmMaterialRequisition.getRawValue();

        if (materialRequisitionData.materialRequisitionProductDetails.length === 0) {
            this.notificationService.warning("Please add at least one product detail.");
            return;
        }

        materialRequisitionData.id = this.materialRequisitionId;
        materialRequisitionData.materialRequisitionDate = this.formatDate(materialRequisitionData.materialRequisitionDate);
        materialRequisitionData.expectedDate = this.formatDate(materialRequisitionData.expectedDate);

        if (this.isEditMode) {
            this.updateMaterialRequisition(materialRequisitionData);
        } else {
            this.createMaterialRequisition(materialRequisitionData);
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
