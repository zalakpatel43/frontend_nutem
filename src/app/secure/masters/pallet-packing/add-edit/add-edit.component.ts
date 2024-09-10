import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { PalletPackingService } from '../pallet-packing.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class PalletPackingAddEditComponent implements OnInit, OnDestroy {
  palletPackingData: any;
  palletPackingId: number;
  isEditMode: boolean;
  palletPackingForm: UntypedFormGroup;
  routerSub: Subscription;
  isFormSubmitted: boolean = false;
  page: string = ApplicationPage.palletPacking;
  permissions = PermissionType;
  error: string;
  productionOrderList: any[] = [];
  productList: any[] = [];
  usersList: any[] = [];
  
  palletPackingDetails: FormArray;
  addedPalletPackingDetailsList: any[] = [];
  editPalletDetailsId: number = -1;
  minEndDate: Date | null = null;
  palletList: any[] = [];
pallet: any;
isEditing: any;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private formBuilder: UntypedFormBuilder, 
    private palletPackingService: PalletPackingService,
    private notificationService: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
    this.addPalletDetail();
  }

  // private getRoute() {
  //   this.routerSub = this.activatedRoute.params.subscribe((params) => {
  //     this.isEditMode = !CommonUtility.isEmpty(params["id"]);
  //     if (this.isEditMode) {
  //       this.palletPackingId = +params.id;
  //       this.getPalletPackingById();
  //     } else {
  //       this.palletPackingForm.reset(); // Reset form for adding new record
  //       this.addedPalletPackingDetailsList = []; // Clear existing details for a new record
  //     }
  //   });
  // }
  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params['id']);
      if (this.isEditMode) {
        this.palletPackingId = +params['id'];
        this.getPalletPackingById();
      }
    });
  }
  private getPalletPackingById() {
    this.palletPackingService.getByIdPalletPacking(this.palletPackingId)
      .subscribe((result: any) => {
        this.palletPackingData = result;
        this.setPalletPackingData();
      },
      (error) => {
        console.log(error);
      });
  }
  private setPalletPackingData() {
    this.palletPackingForm.patchValue({
      PackingDateTime: this.palletPackingData.packingDateTime,
      SAPProductionOrderId: this.palletPackingData.sapProductionOrderId,
      ProductId: this.palletPackingData.productId,
      FinishedCasesOnIncompletePalletAtStart: this.palletPackingData.finishedCasesOnIncompletePalletAtStart,
      FinishedCasesOnIncompletePalletAtEnd: this.palletPackingData.finishedCasesOnIncompletePalletAtEnd,
      TotalCasesProduced: this.palletPackingData.totalCasesProduced,
      SupervisedBy: this.palletPackingData.supervisedId,
      Notes: this.palletPackingData.notes
    });
  
    // Disable certain controls
    this.palletPackingForm.get('SAPProductionOrderId').disable();
    this.palletPackingForm.get('ProductId').disable();
  
    if (this.palletPackingData.palletPackingDetails) {
      this.palletPackingData.palletPackingDetails.forEach(element => {
        const doneByArray: number[] = element.doneByIds.split(',').map(item => Number(item.trim())).filter(value => !isNaN(value));
        const detailsData = {
          PalletNo: element.palletNo,
          Time: new Date(element.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
          DoneByIds: doneByArray, // Ensure DoneByIds is an array
          Id: element.id,
          HeaderId: element.headerId
        };
        this.addedPalletPackingDetailsList.push(detailsData);
      });
  
      this.addPalletDetail();  // Rebuild the FormArray with the updated details
    }
  }
  
  

  private loadDropdowns() {
    this.palletPackingService.getProductionOrderList()
      .subscribe((result: any) => {
        this.productionOrderList = result;
        console.log('data',this.productionOrderList)
      });

    this.palletPackingService.getProductList()
      .subscribe((result: any) => {
        this.productList = result;
      });

    this.palletPackingService.getUserList()
      .subscribe((result: any) => {
        this.usersList = result;
        
      });
  }

  createForm() {
    this.palletPackingForm = this.formBuilder.group({
      PackingDateTime: ['', [Validators.required]],
      SAPProductionOrderId: ['', [Validators.required]],
      ProductId: ['', [Validators.required]],
      FinishedCasesOnIncompletePalletAtStart: ['', [Validators.required]],
      FinishedCasesOnIncompletePalletAtEnd: ['', [Validators.required]],
      TotalCasesProduced: [{value: '', disabled: true}, [Validators.required]],
      SupervisedBy: ['', [Validators.required]],
      Notes: [''],
      palletPackingDetails: this.formBuilder.array([])  // Initialize FormArray
    });
    this.palletPackingDetails = this.palletPackingForm.get('palletPackingDetails') as FormArray;

  // Add a listener for automatic calculation
  this.calculateTotalCasesProduced();

  
  }
  calculateTotalCasesProduced() {
    // Listen to changes in the required fields
    this.palletPackingForm.get('NoOfPalletsCompleted')?.valueChanges.subscribe(() => this.updateTotalCasesProduced());
    this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtStart')?.valueChanges.subscribe(() => this.updateTotalCasesProduced());
    this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtEnd')?.valueChanges.subscribe(() => this.updateTotalCasesProduced());
  }
  
  updateTotalCasesProduced() {
    const noOfPalletsCompleted = this.palletPackingForm.get('NoOfPalletsCompleted')?.value || 0;
    const finishedCasesAtStart = this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtStart')?.value || 0;
    const finishedCasesAtEnd = this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtEnd')?.value || 0;
  
    // Apply the formula
    const totalCasesProduced = (noOfPalletsCompleted * 64) + (finishedCasesAtEnd - finishedCasesAtStart);
  
    // Update the TotalCasesProduced field
    this.palletPackingForm.get('TotalCasesProduced')?.setValue(totalCasesProduced, {emitEvent: false});  // Avoid circular triggers
  }
  
  onPackingDateChange() {
    const packingDate = this.palletPackingForm.get('PackingDateTime')?.value;
    this.minEndDate = packingDate ? new Date(packingDate) : null;
  }

  addPalletDetail() {
    // Get the FormArray from the form group and clear it
    this.palletPackingDetails = this.palletPackingForm.get('palletPackingDetails') as FormArray;
    this.palletPackingDetails.clear();
    this.editPalletDetailsId = -1;
  
    // Create a new FormGroup
    const item = this.formBuilder.group({});
    
    console.log("ProductionOrderList", this.productionOrderList); // Assuming this is your API response for production orders
    
    // Dynamically add controls based on the API response
    this.productionOrderList.forEach((order) => {
      item.addControl(order.id, this.formBuilder.control(""));
    });
    
    // Add the remaining static controls
    item.addControl('PalletNo', this.formBuilder.control(""));
    item.addControl('Time', this.formBuilder.control(""));
    item.addControl('DoneByIds', this.formBuilder.control("")); 
    // Push the dynamically created item FormGroup into the FormArray
    this.palletPackingDetails.push(item);
    console.log("PalletPackingDetails", this.palletPackingDetails.controls);
  }
  
  private formatToDateTime(dateStr: string | null): string | null {
    if (!dateStr) {
      console.error("No date string provided");
      return null;  // Handle missing or invalid date strings gracefully
    }
  
    const now = new Date();  // Use the current date for default values
    let date;
  
    // Check if dateStr contains time only or a full date-time
    if (dateStr.includes('AM') || dateStr.includes('PM')) {
      // If time only, combine with today's date
      date = new Date(`${now.toISOString().split('T')[0]}T${dateStr}`);
    } else {
      // Assume dateStr is in ISO format or a full date-time string
      date = new Date(dateStr);
    }
  
    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided:", dateStr);
      return null;  // Return null or some default value if the date is invalid
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  addFinalPalletDetail() {
    const palletDetail = this.palletPackingDetails.at(0).value;
  
    // Validation
    if (!palletDetail.Time) {
      this.notificationService.error("Please select time");
    } else if (!palletDetail.DoneByIds || palletDetail.DoneByIds.length === 0) {
      this.notificationService.error("Please select Done By");
    } else {
      if (this.editPalletDetailsId >= 0) {
        this.addedPalletPackingDetailsList[this.editPalletDetailsId] = palletDetail;
        this.editPalletDetailsId = -1;
      } else {
        this.addedPalletPackingDetailsList.push(palletDetail);
      }
  
      this.palletPackingDetails.clear();
      this.addPalletDetail();
  
      console.log("Added pallet details:", this.addedPalletPackingDetailsList);
    }
  }
  
  onEditDetail(detail: any, index: number) {
    // Populate form with the details of the selected row
    this.populateFormWithValues([detail]);
    console.log("Editing detail:", detail);
    // Set the index for the edit operation
    this.editPalletDetailsId = index;
  }
  
  populateFormWithValues(data: any | any[]) {
    // Ensure data is in array format
    const dataArray = Array.isArray(data) ? data : [data];
  
    // Retrieve the FormArray
    this.palletPackingDetails = this.palletPackingForm.get('palletPackingDetails') as FormArray;
  
    // Clear existing FormArray
    this.palletPackingDetails.clear();
  
    // Populate each FormGroup in the FormArray
    dataArray.forEach(dataItem => {
      // Create a new FormGroup for each item
      const item = this.formBuilder.group({});
  
      // Add controls with data
      item.addControl('PalletNo', this.formBuilder.control(dataItem.PalletNo || ''));
      item.addControl('Time', this.formBuilder.control(dataItem.Time || ''));
      item.addControl('DoneByIds', this.formBuilder.control(dataItem.DoneByIds || []));  
  
      // Push the populated FormGroup into the FormArray
      this.palletPackingDetails.push(item);
    });
  
    console.log("Populated PalletPackingDetails:", this.palletPackingDetails.controls);
  }
  
  
  removePalletDetail(i: number) {
    this.addedPalletPackingDetailsList.splice(i, 1);
    this.palletPackingDetails.removeAt(i);
  }

  private createPalletPacking(payload) {
    this.palletPackingService.addPalletPacking(payload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Pallet Packing created successfully.");
      },
      (error) => {
        this.error = error;
      });
  }
  private formatDateTime(value: any): string | null {
    if (value) {
      let date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      } else {
        console.error("Invalid date format:", value);
      }
    }
    return null;
  }
  
  private updatePalletPacking(payload) {
    this.palletPackingService.updatePalletPacking(payload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Pallet Packing updated successfully.");
      },
      (error) => {
        this.error = error;
      });
  }
  save() {
    this.isFormSubmitted = true;
  
    if (this.palletPackingForm.invalid) {
      return;
    }
  
    // Validate date and details
    const packingDateTimeControl = this.palletPackingForm.get('PackingDateTime');
    const packingDateTime = packingDateTimeControl?.value;
  
    if (!packingDateTime || isNaN(new Date(packingDateTime).getTime())) {
      this.notificationService.error("Invalid Packing Date Time");
      return;
    }
  
    if (this.addedPalletPackingDetailsList.length === 0) {
      this.notificationService.error("At least one pallet detail is required.");
      return;
    }
  
    // Prepare form value and payload
    const formValue = this.palletPackingForm.value;
    formValue.palletPackingDetails = this.addedPalletPackingDetailsList;
    const payload = this.transformData(formValue);
  
    // Log payload for debugging
    console.log("Transformed Payload:", JSON.stringify(payload, null, 2));
  
    // Decide whether to create or update
    if (this.isEditMode) {
      this.updatePalletPacking(payload);
    } else {
      this.createPalletPacking(payload);
    }
  }
  
  transformData(originalData) {
    function formatToDateTime(dateStr) {
      if (!dateStr) return null;
  
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
  
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  
    const detailsArray = Array.isArray(originalData.palletPackingDetails)
      ? originalData.palletPackingDetails
      : Object.values(originalData.palletPackingDetails || {});
  
    return {
      Id: this.isEditMode ? this.palletPackingData.id : 0,
      Code: this.isEditMode ? this.palletPackingData.code : "",
      PackingDateTime: formatToDateTime(originalData.PackingDateTime),
      SAPProductionOrderId: originalData.SAPProductionOrderId,
      ProductId: originalData.ProductId,
      FinishedCasesOnIncompletePalletAtStart: originalData.FinishedCasesOnIncompletePalletAtStart,
      FinishedCasesOnIncompletePalletAtEnd: originalData.FinishedCasesOnIncompletePalletAtEnd,
      TotalCasesProduced: originalData.TotalCasesProduced,
      SupervisedBy: originalData.SupervisedBy,
      Notes: originalData.Notes,
      palletPackingDetails: detailsArray.map(details => ({
        PalletNo: details.PalletNo,
        Time: formatToDateTime(details.Time),
        // DoneByIds: Array.isArray(details.DoneByIds)
        // ? details.DoneByIds.join(',')  // Convert array to comma-separated string
        // : details.DoneByIds,
    DoneByIds: details.DoneByIds // Ensure this is an array
      }))
    };
  }
  
  
  cancel() {
    if (this.isEditMode) {
      this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
 