import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { Customer, CustomerDetails, CustomerContactDetails, CustomerUserDetails, CustomerTerritoryDetails, List } from '@app-models';
import { CustomerService } from '../customer.service';

@Component({
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class CustomerAddEditComponent implements OnInit, OnDestroy {
    customerData: Customer;
    customerId: number;
    isEditMode: boolean;
    frmCustomer: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.customer;
    permissions = PermissionType;
    error: string;
    categories: List[] = [];
    industries: List[] = [];
    types: List[] = [];
    sources: List[] = [];
    users: any[] = [];
    territories: List[] = [];

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
                private formBuilder: UntypedFormBuilder, private customerService: CustomerService,
                private notificationService: ToastrService,private listService: ListService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getCustomerRoute();
        if (!this.isEditMode) {
            this.generateCustomerCode();
        }
        this.loadDropdowns();
    }

    private getCustomerRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.customerId = +params["id"];
                this.getCustomerDetails();
            }
        });
    }

    private getCustomerDetails() {
        this.customerService.getById(this.customerId)
            .subscribe((result: Customer) => {
                this.customerData = result;
                this.setCustomerData();
            },
            (error) => {
                console.log(error);
            });
    }

    private setCustomerData() {
        this.frmCustomer.patchValue(this.customerData);
        this.customerData.customerDetails.forEach(detail => this.addCustomerDetail(detail));
        this.customerData.customerContactDetails.forEach(contact => this.addCustomerContactDetail(contact));
        this.customerData.customerUserDetails.forEach(user => this.addCustomerUserAssignment(user));
        this.customerData.customerTerritoryDetails.forEach(territory => this.addCustomerTerritory(territory));
    }

    private generateCustomerCode() {
        this.customerService.generateCustomerCode()
            .subscribe((code: string) => {
                this.frmCustomer.patchValue({ customerCode: code });
            }, (error) => {
                console.log(error);
            });
    }

    private loadDropdowns() {
       
      
        this.customerService.getUsers().subscribe(data => this.users = data);
        
        this.listService.getList("customercategory")
        .subscribe((result: any[]) => {
            this.categories = result;
        });

    this.listService.getList("industries")
        .subscribe((result: any[]) => {
            this.industries = result;
        });

    this.listService.getList("customertype")
        .subscribe((result: any[]) => {
            this.types = result;
        });

    this.listService.getList("sources")
        .subscribe((result: any[]) => {
            this.sources = result;
        });

    // this.listService.getList("users")
    //     .subscribe((result: any[]) => {
    //         this.users = result;
    //     });

    this.listService.getList("territories")
        .subscribe((result: any[]) => {
            this.territories = result;
        });
    
    }

    createForm() {
        this.frmCustomer = this.formBuilder.group({
            customerCode: [{ value: '', disabled: true }, [Validators.required]],
            customerName: ['', [Validators.required, Validators.maxLength(256)]],
            customerCategoryId: ['', [Validators.required]],
            industryId: ['', [Validators.required]],
            customerTypeId: ['', [Validators.required]],
            sourceId: ['', [Validators.required]],
            phoneNo: ['', [Validators.required, Validators.maxLength(128)]],
            website: ['', [Validators.maxLength(256)]],
            gstinNo: ['', [Validators.maxLength(256)]],
            customerDetails: this.formBuilder.array([]),
            customerContactDetails: this.formBuilder.array([]),
            customerUserDetails: this.formBuilder.array([]),
            customerTerritoryDetails: this.formBuilder.array([])
        });
    }

    get customerDetails() {
        return this.frmCustomer.get('customerDetails') as UntypedFormArray;
    }

    get customerContactDetails() {
        return this.frmCustomer.get('customerContactDetails') as UntypedFormArray;
    }

    get customerUserDetails() {
        return this.frmCustomer.get('customerUserDetails') as UntypedFormArray;
    }

    get customerTerritoryDetails() {
        return this.frmCustomer.get('customerTerritoryDetails') as UntypedFormArray;
    }

    addCustomerDetail(detail?: CustomerDetails) {
        this.customerDetails.push(this.formBuilder.group({
            location: [detail ? detail.location : '', [Validators.required, Validators.maxLength(256)]],
            street: [detail ? detail.street : '', [Validators.maxLength(1028)]],
            city: [detail ? detail.city : '', [Validators.required, Validators.maxLength(256)]],
            state: [detail ? detail.state : '', [Validators.required, Validators.maxLength(256)]],
            country: [detail ? detail.country : '', [Validators.maxLength(256)]],
            zipCode: [detail ? detail.zipCode : '', [Validators.required, Validators.maxLength(56)]],
            gstinNo: [detail ? detail.gstinNo : '', [Validators.maxLength(256)]],
        }));
    }

    removeCustomerDetail(index: number) {
        this.customerDetails.removeAt(index);
    }

    addCustomerContactDetail(contact?: CustomerContactDetails) {
        this.customerContactDetails.push(this.formBuilder.group({
            contactName: [contact ? contact.contactName : '', [Validators.required, Validators.maxLength(512)]],
            jobTitle: [contact ? contact.jobTitle : '', [ Validators.maxLength(256)]],
            email: [contact ? contact.email : '', [Validators.required, Validators.email]],
            phoneNo: [contact ? contact.phoneNo : '', [ Validators.maxLength(256)]],
            mobile1: [contact ? contact.mobile1 : '', [Validators.required, Validators.maxLength(56)]],
            mobile2: [contact ? contact.mobile2 : '', [Validators.maxLength(56)]],
            department: [contact ? contact.department : '', [Validators.maxLength(256)]],
            designation: [contact ? contact.designation : '', [Validators.maxLength(256)]]
        }));
    }

    removeCustomerContactDetail(index: number) {
        this.customerContactDetails.removeAt(index);
    }

    addCustomerUserAssignment(user?: CustomerUserDetails) {
        this.customerUserDetails.push(this.formBuilder.group({
            userId: [user ? user.userId : '', [Validators.required]]
        }));
    }

    removeCustomerUserAssignment(index: number) {
        this.customerUserDetails.removeAt(index);
    }

    addCustomerTerritory(territory?: CustomerTerritoryDetails) {
        this.customerTerritoryDetails.push(this.formBuilder.group({
            territoryId: [territory ? territory.territoryId : '', [Validators.required]]
        }));
    }

    removeCustomerTerritory(index: number) {
        this.customerTerritoryDetails.removeAt(index);
    }

    private createCustomer() {
        let customer: Customer = this.frmCustomer.getRawValue();
        this.customerService.add(customer)
            .subscribe(() => {
                this.cancel();
                this.notificationService.success("Customer master created successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    private updateCustomer() {
        let customer: Customer = this.frmCustomer.getRawValue();
        this.customerData = Object.assign(this.customerData, this.customerData, customer);

        this.customerService.update(this.customerData.id, this.customerData)
            .subscribe(() => {
                this.cancel();
                this.notificationService.success("Customer master details updated successfully.");
            },
            (error) => {
                this.error = error;
            });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmCustomer.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateCustomer();
        } else {
            this.createCustomer();
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
