import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, FileUploaderService, PermissionType, UserAuthService } from '@app-core';
import { List, SalesOrder, SalesOrderAttachments, SalesOrderProductDetails } from '@app-models';
import { SalesOrderService } from '../sales-order.service';
import { ListService } from '@app-core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { UploadType } from '@app-enums';

@Component({
    templateUrl: './add-edit.component.html',
    providers: [DecimalPipe, DatePipe]
})
export class SalesOrderAddEditComponent implements OnInit, OnDestroy {
    frmSalesOrder: UntypedFormGroup;
    salesOrderData: SalesOrder;
    salesOrderId: number;
    isEditMode: boolean;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.salesOrder;
    permissions = PermissionType;
    error: string;
    users: any[];
    customers: any[];
    customerAddresses: any[];
    salesOrderTypes: any[];
    currencies: any[];
    products: any[];
    discountTypes: any[];
    uoms: List[] = [];
    loggedInUserId: number; // To store the logged-in user's ID

    fileUploader: FileUploaderService;
    uploadDocuments: SalesOrderAttachments[] = [];
    uploadedCount: number = 0;

    routerSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private salesOrderService: SalesOrderService,
        private notificationService: ToastrService, private listService: ListService,
        private authService: UserAuthService, private datePipe: DatePipe) {
        this.loggedInUserId = this.authService.getBrowserUser().id;
        this.createForm();
    }

    ngOnInit(): void {
        this.getSalesOrderRoute();
        this.loadDropdowns();

        if (!this.isEditMode) {
            this.generateSalesOrderCode();
        }
    }

    private createForm() {
        this.frmSalesOrder = this.formBuilder.group({
            salesOrderCode: [{ value: '', disabled: true }],
            revisionNo: [{ value: 'R00', disabled: true }],
            salesPersonId: [this.loggedInUserId, [Validators.required]],
            customerId: ['', [Validators.required]],
            customerDetailId: ['', [Validators.required]],
            customerPONumber: ['', [Validators.required]],
            date: [new Date(), [Validators.required]],
            salesOrderTypeId: ['', [Validators.required]],
            currencyId: ['', [Validators.required]],
            termsCondition: [''],
            totalProductAmount: [{ value: '', disabled: true }],
            discountTypeId: [''],
            discountTypeAmount: [''],
            discountAmount: [{ value: '', disabled: true }],
            subTotal: [{ value: '', disabled: true }],
            totalTaxAmount: [{ value: '', disabled: true }],
            totalAmount: [{ value: '', disabled: true }],
            salesOrderProductDetails: this.formBuilder.array([]),
            salesOrderAttachments: this.formBuilder.array([]),
        });

        this.frmSalesOrder.get('discountTypeId').valueChanges.subscribe(() => {
            this.calculateDiscountAmount();
        });

        this.frmSalesOrder.get('discountTypeAmount').valueChanges.subscribe(() => {
            this.calculateDiscountAmount();
        });
    }

    get salesOrderProductDetails() {
        return this.frmSalesOrder.get('salesOrderProductDetails') as UntypedFormArray;
    }

    get salesOrderAttachments(): UntypedFormArray {
        return this.frmSalesOrder.get('salesOrderAttachments') as UntypedFormArray;
    }

    private getSalesOrderRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            if (this.isEditMode) {
                this.salesOrderId = +params["id"];
                this.getSalesOrderDetails();
            }
        });
    }

    private getSalesOrderDetails() {
        this.salesOrderService.getById(this.salesOrderId)
            .subscribe((result: SalesOrder) => {
                this.salesOrderData = result;

                if (CommonUtility.isNotEmpty(this.salesOrderData.salesOrderAttachments)) {
                    this.salesOrderData.salesOrderAttachments.forEach((document) => {
                        document.hideUploader = document.pictureId > 0;
                        document.uniqueId = CommonUtility.generateUUID();
                        document.uploader = new FileUploaderService({
                            maxAllowedFile: 1,
                            completeCallback: this.uploadCompleted.bind(this, document),
                            onWhenAddingFileFailed: this.uploadFailed.bind(this)
                        });
                    });
                }

                this.setSalesOrderData(result);
                this.updateRevisionNo();
            },
                (error) => {
                    this.error = error;
                });
    }

    private setSalesOrderData(salesOrder: SalesOrder) {
        this.frmSalesOrder.patchValue(salesOrder);
        this.onCustomerChange(salesOrder.customerId);
        if (salesOrder.salesOrderProductDetails) {
            salesOrder.salesOrderProductDetails.forEach((detail, i) => {
                this.addProductDetail(detail);
                if (i === salesOrder.salesOrderProductDetails.length - 1) {
                    this.calculateTotalProductAmount();
                }
            });
        }

        salesOrder.salesOrderAttachments.forEach((attachment) => this.addAttachment(attachment));
    }

    addProductDetail(detail?: SalesOrderProductDetails) {
        const control = this.salesOrderProductDetails;
        control.push(this.formBuilder.group({
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
            expectedDeliveryDate: [detail ? detail.expectedDeliveryDate : '']
        }));
    }

    addAttachment(attachment?: SalesOrderAttachments) {
        let exists: boolean = true;

        if (!attachment) {
            exists = false;

            attachment = new SalesOrderAttachments();
            attachment.pictureId = null;
            attachment.picture = null;
            attachment.documentName = '';
            attachment.hideUploader = false;
            attachment.uniqueId = CommonUtility.generateUUID();
            attachment.uploader = new FileUploaderService({
                maxAllowedFile: 1,
                completeCallback: this.uploadCompleted.bind(this, attachment),
                onWhenAddingFileFailed: this.uploadFailed.bind(this)
            });
        }

        this.salesOrderAttachments.push(this.formBuilder.group({
            documentName: [attachment ? attachment.documentName : '', [Validators.required, Validators.maxLength(256)]],
            pictureId: [attachment ? attachment.pictureId : null],
            uniqueId: [attachment ? attachment.uniqueId : null]
        }));

        if (CommonUtility.isEmpty(this.salesOrderData)) {
            this.salesOrderData = new SalesOrder();
        }

        if (!exists) {
            this.salesOrderData.salesOrderAttachments.push(attachment);
        }
    }

    removeAttachment(index: number) {
        this.salesOrderAttachments.removeAt(index);
        this.salesOrderData.salesOrderAttachments.splice(index, 1);
    }

    removeProductDetail(i: number) {
        const control = this.salesOrderProductDetails;
        control.removeAt(i);
        this.calculateTotalProductAmount();
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmSalesOrder.invalid) {
            return;
        }

        if (this.salesOrderData.salesOrderAttachments.some(d => !d.pictureId && !d.uploader.hasFile())) {
            this.notificationService.warning("Please upload all the required documents.");
            return;
        }

        this.uploadDocuments = this.salesOrderData.salesOrderAttachments.filter(d => d.uploader.hasFile());
        this.uploadedCount = 0;

        if (this.uploadDocuments.length > 0) {
            this.uploadDocuments.forEach((document, index) => {
                if (document.uploader.hasFile()) {
                    document.uploader.uploadFiles({
                        uploadType: UploadType.SalesOrder,
                        id: `0`
                    });
                }
            });
        }
        else {
            this.saveFinal();
        }
    }

    saveFinal() {
        const salesOrderData = this.frmSalesOrder.getRawValue();

        salesOrderData.date = this.formatDate(salesOrderData.date);
        salesOrderData.salesOrderProductDetails.forEach((detail: any) => {
            if (detail.expectedDeliveryDate) {
                detail.expectedDeliveryDate = this.formatDate(detail.expectedDeliveryDate);
            }
        });

        if (this.isEditMode) {
            this.updateSalesOrder(salesOrderData);
        } else {
            this.createSalesOrder(salesOrderData);
        }
    }

    private createSalesOrder(salesOrderData: SalesOrder) {
        this.salesOrderService.add(salesOrderData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Sales Order saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateSalesOrder(salesOrderData: SalesOrder) {
        this.salesOrderService.update(this.salesOrderId, salesOrderData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Sales Order updated successfully.");
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
        this.salesOrderService.getUsers().subscribe(data => this.users = data);
        this.listService.getList("customers").subscribe((result: any[]) => this.customers = result);
        this.listService.getList("salesOrderTypes").subscribe((result: any[]) => this.salesOrderTypes = result);
        this.listService.getList("currencies").subscribe((result: any[]) => this.currencies = result);
        this.listService.getList("finishedproducts").subscribe((result: any[]) => this.products = result);
        this.listService.getList("discountTypes").subscribe((result: any[]) => {
            this.discountTypes = result;
            // Ensure calculateDiscountAmount is called after discountTypes are loaded
            this.calculateDiscountAmount();
        });
    }

    onCustomerChange(customerId: number) {
        this.salesOrderService.getCustomerDetails(customerId).subscribe((result: any[]) => {
            this.customerAddresses = result;
            if (this.isEditMode && this.frmSalesOrder.get('customerDetailId').value) {
                const address = this.customerAddresses.find(addr => addr.id === this.frmSalesOrder.get('customerDetailId').value);
                if (address) {
                    this.frmSalesOrder.get('customerDetailId').setValue(address.id);
                }
            }
            else if (this.customerAddresses.length == 1) {
                this.frmSalesOrder.get('customerDetailId').setValue(this.customerAddresses[0].id);
            }
        });
    }

    onProductChange(index: number, productId: number) {
        this.salesOrderService.getProductUOMs(productId).subscribe((result: List) => {
            const control = this.salesOrderProductDetails.at(index);
            control.get('uomId').setValue(result.id);
            control.get('uomName').setValue(result.name);
            this.updateProductSubTotal(index);
        });
    }

    private generateSalesOrderCode() {
        this.salesOrderService.generateCode().subscribe((code: string) => {
            this.frmSalesOrder.get('salesOrderCode').setValue(code);
        });
    }

    private updateRevisionNo() {
        let currentRevision = this.frmSalesOrder.get('revisionNo').value;
        let revisionNumber = parseInt(currentRevision.replace('R', ''), 10) + 1;
        let newRevisionNo = `R${revisionNumber.toString().padStart(2, '0')}`;
        this.frmSalesOrder.get('revisionNo').setValue(newRevisionNo);
    }

    updateProductSubTotal(index: number) {
        const control = this.salesOrderProductDetails.at(index);
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
        const control = this.salesOrderProductDetails;
        let totalProductAmount = 0;
        control.controls.forEach(group => {
            totalProductAmount += group.get('subTotal').value;
        });
        this.frmSalesOrder.get('totalProductAmount').setValue(totalProductAmount);
        this.calculateDiscountAmount();
    }

    calculateDiscountAmount() {
        const discountTypeId = this.frmSalesOrder.get('discountTypeId').value;
        const discountTypeAmount = this.frmSalesOrder.get('discountTypeAmount').value;
        const totalProductAmount = this.frmSalesOrder.get('totalProductAmount').value;
        let discountAmount = 0;

        if (this.discountTypes && discountTypeId && discountTypeAmount) {
            let discountTypeName = this.discountTypes.find(x => x.id === discountTypeId)?.name ?? '';
            if (discountTypeName.toLocaleLowerCase().startsWith('per')) {
                discountAmount = totalProductAmount * (discountTypeAmount / 100);
            } else if (discountTypeName.toLocaleLowerCase().startsWith('amount')) {
                discountAmount = discountTypeAmount;
            }
        }

        this.frmSalesOrder.get('discountAmount').setValue(discountAmount);
        this.calculateSubTotal();
        this.calculateTotalTaxAmount();
    }

    calculateSubTotal() {
        const totalProductAmount = this.frmSalesOrder.get('totalProductAmount').value;
        const discountAmount = this.frmSalesOrder.get('discountAmount').value;
        const subTotal = totalProductAmount - discountAmount;
        this.frmSalesOrder.get('subTotal').setValue(subTotal);
    }

    calculateTotalTaxAmount() {
        const control = this.salesOrderProductDetails;
        const discountAmount = this.frmSalesOrder.get('discountAmount').value;
        const totalProductAmount = this.frmSalesOrder.get('totalProductAmount').value;
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

        this.frmSalesOrder.get('totalTaxAmount').setValue(totalTaxAmount);
        this.frmSalesOrder.get('subTotal').setValue(subTotal);
        this.frmSalesOrder.get('totalAmount').setValue(totalAmount);
    }

    roundToTwoDecimals(value: number): number {
        return Math.round(value * 100) / 100;
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    hasFile(item: SalesOrderAttachments) {
        return ((this.isEditMode && CommonUtility.isNotEmpty(item.picture)) || item.uploader.hasFile());
    }

    private uploadCompleted(item: any, response: any) {
        this.uploadedCount++;

        const docControl = this.salesOrderAttachments.controls.find(c => c.get('uniqueId').value === item.uniqueId);
        if (docControl) {
            docControl.get('pictureId').setValue(response.id);
        }

        if (this.uploadedCount === this.uploadDocuments.length) {
            this.saveFinal();
        }
    }

    private uploadFailed() {
        this.notificationService.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    selectedFile(item: SalesOrderAttachments) {
        item.hideUploader = true;
    }

    removeEditFile(item: SalesOrderAttachments) {
        item.pictureId = null;
        item.picture = null;
        item.hideUploader = false;
        item.uploader.uploader.clearQueue();
    }
}