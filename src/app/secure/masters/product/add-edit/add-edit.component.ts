import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileConfiguration, List, Product } from '@app-models';
import { ProductService } from '../product.service';
import { FileUploaderService, ListService } from '@app-core';
import { CommonUtility, ApplicationPage, PermissionType } from '@app-core';
import { UploadType } from '@app-enums';

@Component({
    templateUrl: './add-edit.component.html'
})
export class ProductAddEditComponent implements OnInit, OnDestroy {
    productData: Product;
    productId: number;
    isEditMode: boolean;
    frmProduct: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.product;
    permissions = PermissionType;
    error: string;

    productGroups: List[] = [];
    productCategories: List[] = [];
    productTypes: List[] = [];
    productBrands: List[] = [];
    productSizes: List[] = [];
    interStateTaxes: List[] = [];
    intraStateTaxes: List[] = [];
    uoms: List[] = [];

    fileOptions: FileConfiguration = {
        maxAllowedFile: 1,
        completeCallback: this.uploadCompleted.bind(this),
        onWhenAddingFileFailed: this.uploadFailed.bind(this)
    };

    fileUploader: FileUploaderService = new FileUploaderService(this.fileOptions);

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private productService: ProductService,
        private notificationService: ToastrService, private listService: ListService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getProductRoute();
        this.loadDropdowns();
        if (!this.isEditMode) {
            this.generateProductCode();
        }
    }

    private getProductRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.productId = +params["id"];
                this.getProductDetails();
            }
        });
    }

    private getProductDetails() {
        this.productService.getById(this.productId)
            .subscribe((result: Product) => {
                this.productData = result;
                this.setProductData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setProductData() {
        this.frmProduct.patchValue(this.productData);
    }

    createForm() {
        this.frmProduct = this.formBuilder.group({
            productCode: ['', [Validators.required, Validators.maxLength(56)]],
            productName: ['', [Validators.required, Validators.maxLength(512)]],
            productGroupId: [null],
            productCategoryId: [null, [Validators.required]],
            productTypeId: [null, [Validators.required]],
            productBrandId: [null],
            productSizeId: [null],
            hsnCode: ['', [Validators.required, Validators.maxLength(256)]],
            productDescription: ['', [Validators.required, Validators.maxLength(2048)]],
            partCode: [''],
            interStateTaxId: [null, [Validators.required]],
            intraStateTaxId: [null, [Validators.required]],
            uomId: [null, [Validators.required]],
            productModelNumber: [''],
            productImageId: [null],
            productionCompletionDays: ['', [Validators.required]],
            isActive: [true]
        });
    }

    private uploadDocuments(id: number) {
        this.fileUploader.uploadFiles({
            uploadType: UploadType.Product,
            id: id.toString()
        });
    }

    private uploadCompleted() {
        this.cancel();

        if (this.isEditMode) {
            this.notificationService.success("Product updated successfully.");
        } else {
            this.notificationService.success("Product saved successfully.");
        }
    }

    private uploadFailed() {
        this.notificationService.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    onSelectFile(event) {

    }

    removeFile(event) {
        if (this.productData) {
            this.productData.productImageId = null;
            this.productData.productImage = null;
            this.frmProduct.controls['productImageId'].setValue(null);
        }

        this.fileUploader.uploader.clearQueue();
    }

    canHideUploader(): boolean {
        let hideUploader: boolean = false;

        if ((this.productData && this.productData.productImageId > 0) || this.fileUploader.hasFile()) {
            hideUploader = true;
        }

        return hideUploader;
    }

    private createProduct() {
        let product: Product = this.frmProduct.value;
        this.productService.add(product)
            .subscribe((result) => {
                if (this.fileUploader.hasFile()) {
                    this.uploadDocuments(result.id);
                }
                else {
                    this.cancel();
                    this.notificationService.success("Product saved successfully.");
                }
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateProduct() {
        let product: Product = this.frmProduct.value;
        this.productData = Object.assign(this.productData, this.productData, product);

        this.productService.update(this.productData.id, this.productData)
            .subscribe((result) => {
                if (this.fileUploader.hasFile()) {
                    this.uploadDocuments(result.id);
                }
                else {
                    this.cancel();
                    this.notificationService.success("Product updated successfully.");
                }
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmProduct.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateProduct();
        } else {
            this.createProduct();
        }
    }

    private loadDropdowns() {
        this.listService.getList("productGroups")
            .subscribe((result: List[]) => {
                this.productGroups = result;
            });

        this.listService.getList("productCategories")
            .subscribe((result: List[]) => {
                this.productCategories = result;
            });

        this.listService.getList("productTypes")
            .subscribe((result: List[]) => {
                this.productTypes = result;
            });

        this.listService.getList("productBrands")
            .subscribe((result: List[]) => {
                this.productBrands = result;
            });

        this.listService.getList("productSizes")
            .subscribe((result: List[]) => {
                this.productSizes = result;
            });

        this.listService.getList("interStateTaxes")
            .subscribe((result: List[]) => {
                this.interStateTaxes = result;
            });

        this.listService.getList("intraStateTaxes")
            .subscribe((result: List[]) => {
                this.intraStateTaxes = result;
            });

        this.listService.getList("uoms")
            .subscribe((result: List[]) => {
                this.uoms = result;
            });
    }

    private generateProductCode() {
        this.productService.generateCode()
            .subscribe((code: string) => {
                this.frmProduct.patchValue({ productCode: code });
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
}
