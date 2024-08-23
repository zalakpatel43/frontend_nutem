import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType, UserAuthService } from '@app-core';
import { List, PurchaseOrder, PurchaseOrderProductDetails, PurchaseOrderTermsDetails } from '@app-models';
import { PurchaseOrderService } from '../purchase-order.service';
import { ListService } from '@app-core';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
    templateUrl: './add-edit.component.html',
    providers: [DecimalPipe, DatePipe]
})
export class PurchaseOrderAddEditComponent implements OnInit, OnDestroy {
    frmPurchaseOrder: UntypedFormGroup;
    purchaseOrderId: number;
    isEditMode: boolean;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.purchaseOrder;
    permissions = PermissionType;
    error: string;
    vendors: List[];
    vendorAddresses: List[];
    vendorContacts: List[];
    products: List[];
    discountTypes: List[];
    approvalStatuses: List[];
    termsConditions: List[];
    uoms: List[] = [];
    loggedInUserId: number;

    routerSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
                private formBuilder: UntypedFormBuilder, private purchaseOrderService: PurchaseOrderService,
                private notificationService: ToastrService, private listService: ListService,
                private authService: UserAuthService, private datePipe: DatePipe) {
        this.loggedInUserId = this.authService.getBrowserUser().id; 
        this.createForm();
    }

    ngOnInit(): void {
        this.getPurchaseOrderRoute();
        this.loadDropdowns();
        if (!this.isEditMode) {
             this.generatePurchaseOrderCode();
        }
    }

    private createForm() {
        this.frmPurchaseOrder = this.formBuilder.group({
            purchaseOrderCode: [{ value: '', disabled: true }],
            revisionNo: [{ value: 'R00', disabled: true }],
            vendorId: ['', [Validators.required]],
            vendorAddressId: ['', [Validators.required]],
            vendorContactId: ['', [Validators.required]],
            poDate: [new Date(), [Validators.required]],
            totalProductAmount: [{ value: '', disabled: true }],
            discountTypeId: [''],
            discountTypeAmount: [''],
            discountAmount: [{ value: '', disabled: true }],
            subTotal: [{ value: '', disabled: true }],
            totalTaxAmount: [{ value: '', disabled: true }],
            totalAmount: [{ value: '', disabled: true }],
            approvalStatusId: ['', [Validators.required]],
            purchaseOrderProductDetails: this.formBuilder.array([]),
            purchaseOrderTermsDetails: this.formBuilder.array([])
        });

        this.frmPurchaseOrder.get('discountTypeId').valueChanges.subscribe(() => {
            this.calculateDiscountAmount();
        });

        this.frmPurchaseOrder.get('discountTypeAmount').valueChanges.subscribe(() => {
            this.calculateDiscountAmount();
        });
    }

    get purchaseOrderProductDetails() {
        return this.frmPurchaseOrder.get('purchaseOrderProductDetails') as UntypedFormArray;
    }

    get purchaseOrderTermsDetails() {
        return this.frmPurchaseOrder.get('purchaseOrderTermsDetails') as UntypedFormArray;
    }

    private getPurchaseOrderRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.purchaseOrderId = +params["id"];
                this.getPurchaseOrderDetails();
            }
        });
    }

    private getPurchaseOrderDetails() {
        this.purchaseOrderService.getById(this.purchaseOrderId)
            .subscribe((result: PurchaseOrder) => {
                this.setPurchaseOrderData(result);
                this.updateRevisionNo();
            },
            (error) => {
                this.error = error;
            });
    }

    private setPurchaseOrderData(purchaseOrder: PurchaseOrder) {
        this.frmPurchaseOrder.patchValue(purchaseOrder);
        this.onVendorChange(purchaseOrder.vendorId);
        if (purchaseOrder.purchaseOrderProductDetails) {
            purchaseOrder.purchaseOrderProductDetails.forEach((detail, i) => {
                this.addProductDetail(detail);
                if (i === purchaseOrder.purchaseOrderProductDetails.length - 1) {
                    this.calculateTotalProductAmount();
                }
            });
        }
        if (purchaseOrder.purchaseOrderTermsDetails) {
            purchaseOrder.purchaseOrderTermsDetails.forEach((detail) => {
                this.addTermsConditionDetail(detail);
            });
        }
    }

    addProductDetail(detail?: PurchaseOrderProductDetails) {
        const control = this.purchaseOrderProductDetails;
        control.push(this.formBuilder.group({
            drawingNumber: [detail ? detail.drawingNumber : '', [Validators.required]],
            productId: [detail ? detail.productId : '', [Validators.required]],
            uomId: [detail ? detail.uomId : '', [Validators.required]],
            uomName: [{ value: detail ? detail.uomName : '', disabled: true }],
            qty: [detail ? detail.qty : '', [Validators.required]],
            amount: [detail ? detail.amount : '', [Validators.required]],
            discountTypeId: [detail ? detail.discountTypeId : ''],
            discountTypeAmount: [detail ? detail.discountTypeAmount : ''],
            discountAmount: [{ value: detail ? detail.discountAmount : '', disabled: true }],
            subTotal: [{ value: detail ? detail.subTotal : '', disabled: true }, [Validators.required]],
            taxTypeAmount: [detail ? detail.taxTypeAmount : '', [Validators.required]],
            deliveryDate: [detail ? detail.deliveryDate : '']
        }));
    }

    removeProductDetail(i: number) {
        const control = this.purchaseOrderProductDetails;
        control.removeAt(i);
        this.calculateTotalProductAmount();
    }

    addTermsConditionDetail(detail?: PurchaseOrderTermsDetails) {
        const control = this.purchaseOrderTermsDetails;
        control.push(this.formBuilder.group({
            termsConditionId: [detail ? detail.termsConditionId : '', [Validators.required]]
        }));
    }

    removeTermsConditionDetail(i: number) {
        const control = this.purchaseOrderTermsDetails;
        control.removeAt(i);
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmPurchaseOrder.invalid) {
            return;
        }

        const purchaseOrderData = this.frmPurchaseOrder.getRawValue();

        purchaseOrderData.poDate = this.formatDate(purchaseOrderData.poDate);
        purchaseOrderData.purchaseOrderProductDetails.forEach((detail: any) => {
            if (detail.deliveryDate) {
                detail.deliveryDate = this.formatDate(detail.deliveryDate);
            }
        });

        if (this.isEditMode) {
            this.updatePurchaseOrder(purchaseOrderData);
        } else {
            this.createPurchaseOrder(purchaseOrderData);
        }
    }

    private createPurchaseOrder(purchaseOrderData: PurchaseOrder) {
        this.purchaseOrderService.add(purchaseOrderData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Purchase Order saved successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    private updatePurchaseOrder(purchaseOrderData: PurchaseOrder) {
        this.purchaseOrderService.update(this.purchaseOrderId, purchaseOrderData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Purchase Order updated successfully.");
                this.updateRevisionNo();
            },
            (error) => {
                this.error = error;
            });
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

    private loadDropdowns() {
        this.listService.getList("vendors").subscribe(data => this.vendors = data);
        this.listService.getList("finishedproducts").subscribe((result: any[]) => this.products = result);
        this.listService.getList("discountTypes").subscribe((result: any[]) => {
            this.discountTypes = result;
            this.calculateDiscountAmount();
        });
        this.listService.getList("approvalStatuses").subscribe((result: any[]) => this.approvalStatuses = result);
        this.listService.getList("termsConditions").subscribe((result: any[]) => this.termsConditions = result);
    }

    onVendorChange(vendorId: number) {
        this.purchaseOrderService.getVendorAddresses(vendorId).
        subscribe((data) => 
            {
                this.vendorAddresses = data;
                if (this.isEditMode && this.frmPurchaseOrder.get('vendorAddressId').value) {
                    const address = this.vendorAddresses.find(addr => addr.id === this.frmPurchaseOrder.get('vendorAddressId').value);
                    if (address) {
                        this.frmPurchaseOrder.get('vendorAddressId').setValue(address.id);
                    }
                }
                else if(this.vendorAddresses.length == 1)
                    {
                        this.frmPurchaseOrder.get('vendorAddressId').setValue(this.vendorAddresses[0].id);
                    }
            });
           this.purchaseOrderService.getVendorContacts(vendorId).subscribe((data) =>
            {
                this.vendorContacts = data;          
                if (this.isEditMode && this.frmPurchaseOrder.get('vendorContactId').value) {
                    const address = this.vendorContacts.find(addr => addr.id === this.frmPurchaseOrder.get('vendorContactId').value);
                    if (address) {
                        this.frmPurchaseOrder.get('vendorContactId').setValue(address.id);
                    }
                }
                else if(this.vendorContacts.length == 1)
                {
                    this.frmPurchaseOrder.get('vendorContactId').setValue(this.vendorContacts[0].id);
                }
            });
    }

    onProductChange(index: number, productId: number) {
        this.purchaseOrderService.getProductUOMs(productId).subscribe((result: List) => {
            const control = this.purchaseOrderProductDetails.at(index);
            control.get('uomId').setValue(result.id);
            control.get('uomName').setValue(result.name);
            this.updateProductSubTotal(index);
        });
    }

    private generatePurchaseOrderCode() {
        this.purchaseOrderService.generateCode().subscribe((code: string) => {
            this.frmPurchaseOrder.get('purchaseOrderCode').setValue(code);
        });
    }

    private updateRevisionNo() {
        let currentRevision = this.frmPurchaseOrder.get('revisionNo').value;
        let revisionNumber = parseInt(currentRevision.replace('R', ''), 10) + 1;
        let newRevisionNo = `R${revisionNumber.toString().padStart(2, '0')}`;
        this.frmPurchaseOrder.get('revisionNo').setValue(newRevisionNo);
    }

    updateProductSubTotal(index: number) {
        const control = this.purchaseOrderProductDetails.at(index);
        const drawingNumber = control.get('drawingNumber').value;
        const qty = control.get('qty').value;
        const amount = control.get('amount').value;
        const discountTypeId = control.get('discountTypeId').value;
        const discountTypeAmount = control.get('discountTypeAmount').value;
        let discountAmount = 0;

        if (discountTypeId && discountTypeAmount) {
            let discountTypeName = this.discountTypes.find(x => x.id === discountTypeId)?.name ?? '';
            if (discountTypeName.toLocaleLowerCase().startsWith('per')) {
                discountAmount = (amount * qty) * (discountTypeAmount / 100);
            } else if (discountTypeName.toLocaleLowerCase().startsWith('amount')) {
                discountAmount = discountTypeAmount;
            }
        }

        const subTotal = (amount * qty) - discountAmount;

        control.get('discountAmount').setValue(discountAmount);
        control.get('subTotal').setValue(subTotal);
        this.calculateTotalProductAmount();
    }

    calculateTotalProductAmount() {
        const control = this.purchaseOrderProductDetails;
        let totalProductAmount = 0;
        control.controls.forEach(group => {
            totalProductAmount += group.get('subTotal').value;
        });
        this.frmPurchaseOrder.get('totalProductAmount').setValue(totalProductAmount);
        this.calculateDiscountAmount();
    }

    calculateDiscountAmount() {
        const discountTypeId = this.frmPurchaseOrder.get('discountTypeId').value;
        const discountTypeAmount = this.frmPurchaseOrder.get('discountTypeAmount').value;
        const totalProductAmount = this.frmPurchaseOrder.get('totalProductAmount').value;
        let discountAmount = 0;

        if (this.discountTypes && discountTypeId && discountTypeAmount) {
            let discountTypeName = this.discountTypes.find(x => x.id === discountTypeId)?.name ?? '';
            if (discountTypeName.toLocaleLowerCase().startsWith('per')) {
                discountAmount = totalProductAmount * (discountTypeAmount / 100);
            } else if (discountTypeName.toLocaleLowerCase().startsWith('amount')) {
                discountAmount = discountTypeAmount;
            }
        }

        this.frmPurchaseOrder.get('discountAmount').setValue(discountAmount);
        this.calculateSubTotal();
        this.calculateTotalTaxAmount();
    }

    calculateSubTotal() {
        const totalProductAmount = this.frmPurchaseOrder.get('totalProductAmount').value;
        const discountAmount = this.frmPurchaseOrder.get('discountAmount').value;
        const subTotal = totalProductAmount - discountAmount;
        this.frmPurchaseOrder.get('subTotal').setValue(subTotal);
    }

    calculateTotalTaxAmount() {
        const control = this.purchaseOrderProductDetails;
        const discountAmount = this.frmPurchaseOrder.get('discountAmount').value;
        const totalProductAmount = this.frmPurchaseOrder.get('totalProductAmount').value;
        let totalTaxAmount = 0;

        control.controls.forEach(group => {
            const subTotal = group.get('subTotal').value;
            const taxTypeAmount = group.get('taxTypeAmount').value;

            const proportionalDiscount = (subTotal / totalProductAmount) * discountAmount;
            const taxableAmount = subTotal - proportionalDiscount;
            const taxAmount = this.roundToTwoDecimals(taxableAmount * (taxTypeAmount / 100));

            totalTaxAmount += taxAmount;
        });

        const subTotal = totalProductAmount - discountAmount;
        const totalAmount = subTotal + totalTaxAmount;

        this.frmPurchaseOrder.get('totalTaxAmount').setValue(totalTaxAmount);
        this.frmPurchaseOrder.get('subTotal').setValue(subTotal);
        this.frmPurchaseOrder.get('totalAmount').setValue(totalAmount);
    }

    roundToTwoDecimals(value: number): number {
        return Math.round(value * 100) / 100;
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }
}
