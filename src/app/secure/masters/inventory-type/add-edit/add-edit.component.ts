import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { InventoryType, List } from '@app-models';  // Adjust the import path as necessary
import { InventoryTypeService } from '../inventory-type.service';

@Component({
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class InventoryTypeAddEditComponent implements OnInit, OnDestroy {
    inventoryTypeData: InventoryType;
    inventoryTypeId: number;
    isEditMode: boolean;
    frmInventoryType: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.inventoryType;
    permissions = PermissionType;
    error: string;
    applicableToOptions: List[] = [
        { id: 1, name: 'Customer' },
        { id: 2, name: 'Vendor' },
        { id: 3, name: 'Warehouse' }
    ];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private inventoryTypeService: InventoryTypeService,
        private notificationService: ToastrService,
        private listService: ListService
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getInventoryTypeRoute();
    }

    private getInventoryTypeRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.inventoryTypeId = +params["id"];
                this.getInventoryTypeDetails();
            }
            else {
                this.generateInventoryTypeCode();
            }
        });
    }

    private generateInventoryTypeCode() {
        this.inventoryTypeService.generateInventoryTypeCode()
            .subscribe((code: string) => {
                this.frmInventoryType.patchValue({ inventoryTypeCode: code });
            }, (error) => {
                console.log(error);
            });
    }

    private getInventoryTypeDetails() {
        this.inventoryTypeService.getById(this.inventoryTypeId)
            .subscribe((result: InventoryType) => {
                this.inventoryTypeData = result;
                this.setInventoryTypeData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setInventoryTypeData() {
        this.frmInventoryType.patchValue(this.inventoryTypeData);
    }

    private createForm() {
        this.frmInventoryType = this.formBuilder.group({
            inventoryTypeCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(32)]],
            inventoryTypeName: ['', [Validators.required, Validators.maxLength(255)]],
            isInward: [true, Validators.required],
            applicableToId: [null, Validators.required],
            isSales: [false],
            isPurchase: [false],
            isReserve: [false],
            isAdmin: [false]
        });
    }

    private createInventoryType() {
        let inventoryType: InventoryType = this.frmInventoryType.getRawValue();

        this.inventoryTypeService.add(inventoryType)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Inventory Type saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateInventoryType() {
        let inventoryType: InventoryType = this.frmInventoryType.getRawValue();
        this.inventoryTypeData = Object.assign(this.inventoryTypeData, this.inventoryTypeData, inventoryType);

        this.inventoryTypeService.update(this.inventoryTypeData.id, this.inventoryTypeData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Inventory Type updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.frmInventoryType.invalid) {
            return;
        }

        let inventoryType: InventoryType = this.frmInventoryType.getRawValue();
        if (inventoryType && (!inventoryType.isPurchase && !inventoryType.isSales && !inventoryType.isReserve && !inventoryType.isAdmin)) {
            this.notificationService.warning("Please select at least one transaction to be considered as checkbox.");
            return;
        }

        if (this.isEditMode) {
            this.updateInventoryType();
        }
        else {
            this.createInventoryType();
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
}
