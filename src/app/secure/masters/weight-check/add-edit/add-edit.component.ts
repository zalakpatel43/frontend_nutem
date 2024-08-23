import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { List } from '@app-models';
import { Subscription } from 'rxjs';
import { WeightCheckService } from '../weight-check.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
  // standalone: false,
  // imports: [],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class WeightCheckAddEditComponent implements OnInit, OnDestroy {
  weightCheckData: any;
  weightCheckId: number;
  isEditMode: boolean;
  WeightCheckForm: UntypedFormGroup;
  routerSub: Subscription;
  isFormSubmitted: boolean;
  page: string = ApplicationPage.weightCheck;
  permissions = PermissionType;
  error: string;
  shiftList: any[] = [];
  productionOrderList: any[] = [];
  productList: any[] = [];
  NozzleList:any[] = [];
  usersList: any[] = [];
  WeightCheckDetails : FormArray;
  NozzleNameList : any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private formBuilder: UntypedFormBuilder, private weightCheckService: WeightCheckService,
              private notificationService: ToastrService,private listService: ListService) {
      this.createForm();
  }

  ngOnInit(): void {
      this.getRoute();
      if (!this.isEditMode) {
          this.generateCustomerCode();
        //  this.addWeightDetail(); call after nozzlelist
      }
      this.loadDropdowns();
  }

  private getRoute() {
      this.routerSub = this.activatedRoute.params.subscribe((params) => {
          this.isEditMode = !CommonUtility.isEmpty(params["id"]);
          this.createForm();
          if (this.isEditMode) {
              this.weightCheckId = params.id//+params["id"];
              this.getCustomerDetails();
          }
      });
  }

  private getCustomerDetails() {
      // this.customerService.getById(this.customerId)
      //     .subscribe((result: Customer) => {
      //         this.customerData = result;
      //         this.setCustomerData();
      //     },
      //     (error) => {
      //         console.log(error);
      //     });
  }

  private setCustomerData() {
      // this.frmCustomer.patchValue(this.customerData);
      // this.customerData.customerDetails.forEach(detail => this.addCustomerDetail(detail));
      // this.customerData.customerContactDetails.forEach(contact => this.addCustomerContactDetail(contact));
      // this.customerData.customerUserDetails.forEach(user => this.addCustomerUserAssignment(user));
      // this.customerData.customerTerritoryDetails.forEach(territory => this.addCustomerTerritory(territory));
  }

  private generateCustomerCode() {
      // this.customerService.generateCustomerCode()
      //     .subscribe((code: string) => {
      //         this.frmCustomer.patchValue({ customerCode: code });
      //     }, (error) => {
      //         console.log(error);
      //     });
  }

  private loadDropdowns() {
     
    this.weightCheckService.getNozzleList()
      .subscribe((result: any) => {
          this.NozzleList = result;
          this.addWeightDetail();
      });

      this.weightCheckService.getShiftList()
      .subscribe((result: any) => {
          this.shiftList = result;
      });

      this.weightCheckService.getProductionOrderList()
      .subscribe((result: any) => {
          this.productionOrderList = result;
      });

      this.weightCheckService.getProductList()
      .subscribe((result: any) => {
          this.productList = result;
      });

      this.weightCheckService.getUserList()
      .subscribe((result: any) => {
          this.usersList = result;
      });
  }

  createForm() {
      this.WeightCheckForm = this.formBuilder.group({
          Code: [{ value: '', disabled: true }, [Validators.required]],
          StartDateTime: ['', [Validators.required]],
          EndDateTime: ['', [Validators.required,this.endDateValidator]],
          ShiftId: ['', [Validators.required]],
          SAPProductionOrderId: ['', [Validators.required]],
          ProductId: ['', [Validators.required]],
          BottleDateCode: ['', [Validators.required]],
          PackSize: ['', [Validators.required]],
          StandardWeight: ['', [Validators.required]],
          MinWeightRange: ['', [Validators.required]],
          MaxWeightRange: ['', [Validators.required]],
          QAUserId: ['', [Validators.required]],
          Note: ['', [Validators.required]],
          WeightCheckDetails: this.formBuilder.array([])
      });
      this.WeightCheckForm.controls["StartDateTime"].setValue(new Date().toISOString().split('T')[0]);
  }

   endDateValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const start = control.get('StartDateTime')?.value;
    const end = control.get('EndDateTime')?.value;
    return end && start && end < start ? { 'endDateBeforeStartDate': true } : null;
};

getToday(){
    return new Date().toISOString().split('T')[0];
}
  // get customerDetails() {
  //     return this.frmCustomer.get('customerDetails') as UntypedFormArray;
  // }

  // get customerContactDetails() {
  //     return this.frmCustomer.get('customerContactDetails') as UntypedFormArray;
  // }

  // get customerUserDetails() {
  //     return this.frmCustomer.get('customerUserDetails') as UntypedFormArray;
  // }

  // get customerTerritoryDetails() {
  //     return this.frmCustomer.get('customerTerritoryDetails') as UntypedFormArray;
  // }

  addWeightDetail() {
    const item = this.formBuilder.group({});
console.log("NozzleList", this.NozzleList)
    // Dynamically add NozzleName controls based on the API response
    this.NozzleList.forEach((nozzle, index) => {
        item.addControl(nozzle.nozzelName, this.formBuilder.control(nozzle.nozzelName));
      //  this.NozzleNameList.push(nozzle.nozzelName);
    });

    // Add the remaining static controls
    item.addControl('Time', this.formBuilder.control("", Validators.required));
    item.addControl('DoneBy', this.formBuilder.control("", Validators.required));

    // Push the dynamically created item form group into the ItemList form array
    this.WeightCheckDetails = this.WeightCheckForm?.get('WeightCheckDetails') as FormArray;
    this.WeightCheckDetails.push(item);
    console.log("weightDeatilsList", this.WeightCheckDetails)
  }

  removeWeightDetail(i: number) {
    const control = <FormArray>this.WeightCheckForm?.controls['ItemList'];
    control.removeAt(i);
    console.log("control", this.WeightCheckDetails)
    console.log("items", this.WeightCheckDetails);
  }

  removeCustomerDetail(index: number) {
    //  this.customerDetails.removeAt(index);
  }

  // addCustomerContactDetail(contact?: CustomerContactDetails) {
  //     this.customerContactDetails.push(this.formBuilder.group({
  //         contactName: [contact ? contact.contactName : '', [Validators.required, Validators.maxLength(512)]],
  //         jobTitle: [contact ? contact.jobTitle : '', [ Validators.maxLength(256)]],
  //         email: [contact ? contact.email : '', [Validators.required, Validators.email]],
  //         phoneNo: [contact ? contact.phoneNo : '', [ Validators.maxLength(256)]],
  //         mobile1: [contact ? contact.mobile1 : '', [Validators.required, Validators.maxLength(56)]],
  //         mobile2: [contact ? contact.mobile2 : '', [Validators.maxLength(56)]],
  //         department: [contact ? contact.department : '', [Validators.maxLength(256)]],
  //         designation: [contact ? contact.designation : '', [Validators.maxLength(256)]]
  //     }));
  // }

  removeCustomerContactDetail(index: number) {
     // this.customerContactDetails.removeAt(index);
  }

  // addCustomerUserAssignment(user?: CustomerUserDetails) {
  //     this.customerUserDetails.push(this.formBuilder.group({
  //         userId: [user ? user.userId : '', [Validators.required]]
  //     }));
  // }

  removeCustomerUserAssignment(index: number) {
     // this.customerUserDetails.removeAt(index);
  }

  // addCustomerTerritory(territory?: CustomerTerritoryDetails) {
  //     this.customerTerritoryDetails.push(this.formBuilder.group({
  //         territoryId: [territory ? territory.territoryId : '', [Validators.required]]
  //     }));
  // }

  removeCustomerTerritory(index: number) {
    //  this.customerTerritoryDetails.removeAt(index);
  }

  private createCustomer() {
      // let customer: Customer = this.frmCustomer.getRawValue();
      // this.customerService.add(customer)
      //     .subscribe(() => {
      //         this.cancel();
      //         this.notificationService.success("Customer master created successfully.");
      //     },
      //     (error) => {
      //         this.error = error;
      //     });
  }

  private updateCustomer() {
      // let customer: Customer = this.frmCustomer.getRawValue();
      // this.customerData = Object.assign(this.customerData, this.customerData, customer);

      // this.customerService.update(this.customerData.id, this.customerData)
      //     .subscribe(() => {
      //         this.cancel();
      //         this.notificationService.success("Customer master details updated successfully.");
      //     },
      //     (error) => {
      //         this.error = error;
      //     });
  }

  save() {
      this.isFormSubmitted = true;
      if (this.WeightCheckForm.invalid) {
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
