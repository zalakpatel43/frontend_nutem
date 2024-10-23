import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { PalletPackingService } from '../pallet-packing.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from 'src/app/core/service/permission.service';

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
  userMap: any;

  IsViewPermission: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private palletPackingService: PalletPackingService,
    private notificationService: ToastrService,
    private permissionService: PermissionService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
    this.addPalletDetail();
    this.IsViewPermission = this.permissionService.hasPermission('Pallet Packing (PER_PALLETPACKING) - View');

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
      SupervisedBy: this.palletPackingData.supervisedBy,
      Notes: this.palletPackingData.notes
    });

    this.palletPackingForm.get('SAPProductionOrderId').disable();
    this.palletPackingForm.get('ProductId').disable();
    this.palletPackingForm.get('TotalCasesProduced').disable();

    if (this.palletPackingData.palletPackingDetails) {
      this.palletPackingData.palletPackingDetails.forEach(element => {
        const doneByArray: number[] = element.doneByIds
          ? element.doneByIds.split(',').map(item => Number(item.trim())).filter(value => !isNaN(value))
          : []; // Ensure it's always an array
        const detailsData = {
          PalletNo: element.palletNo,
          Time: new Date(element.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
          DoneByIds: doneByArray, // Ensure it's an array
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
        // console.log('data', this.productionOrderList)
      });

    this.palletPackingService.getProductList()
      .subscribe((result: any) => {
        this.productList = result;
      });

    this.palletPackingService.getUserList()
      .subscribe((result: any) => {
        this.usersList = result;
        this.initializeUserMap(); // Initialize userMap here
      });
  }
  private initializeUserMap() {
    this.userMap = new Map<number, string>();
    this.usersList.forEach(user => {
      this.userMap.set(user.id, user.name);
    });
  }
  createForm() {
    this.palletPackingForm = this.formBuilder.group({
      PackingDateTime: ['', [Validators.required]],
      SAPProductionOrderId: ['', [Validators.required]],
      ProductId: ['', [Validators.required]],
      FinishedCasesOnIncompletePalletAtStart: ['', [Validators.required]],
      FinishedCasesOnIncompletePalletAtEnd: [''],
      TotalCasesProduced: { value: '' },
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
    this.palletPackingForm.get('TotalCasesProduced')?.valueChanges.subscribe(() => this.updateTotalCasesProduced());
    this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtStart')?.valueChanges.subscribe(() => this.updateTotalCasesProduced());
    this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtEnd')?.valueChanges.subscribe(() => this.updateTotalCasesProduced());
  }

  updateTotalCasesProduced() {
    const noOfPalletsCompleted = this.addedPalletPackingDetailsList.length || 1;
    const finishedCasesAtStart = this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtStart')?.value || 0;
    const finishedCasesAtEnd = this.palletPackingForm.get('FinishedCasesOnIncompletePalletAtEnd')?.value || 0;


    // console.log('NoOfPalletsCompleted:', noOfPalletsCompleted);
    // console.log('FinishedCasesAtStart:', finishedCasesAtStart);
    //  console.log('FinishedCasesAtEnd:', finishedCasesAtEnd);

    // Apply the formula
    const totalCasesProduced = (noOfPalletsCompleted * 64) + (finishedCasesAtEnd - finishedCasesAtStart);

    // Update the TotalCasesProduced field
    this.palletPackingForm.get('TotalCasesProduced')?.setValue(totalCasesProduced, { emitEvent: false });  // Avoid circular triggers
  }

  onPackingDateChange() {
    const packingDate = this.palletPackingForm.get('PackingDateTime')?.value;
    this.minEndDate = packingDate ? new Date(packingDate) : null;
  }

  addPalletDetail() {
    this.palletPackingDetails = this.palletPackingForm.get('palletPackingDetails') as FormArray;
    this.palletPackingDetails.clear();
    this.editPalletDetailsId = -1;

    const item = this.formBuilder.group({});

    this.productionOrderList.forEach((order) => {
      item.addControl(order.id.toString(), this.formBuilder.control(""));
    });

    item.addControl('PalletNo', this.formBuilder.control(""));
    item.addControl('Time', this.formBuilder.control(""));
    item.addControl('DoneByIds', this.formBuilder.control([]));  // Initialize as an array

    this.palletPackingDetails.push(item);
    // console.log("PalletPackingDetails", this.palletPackingDetails.controls);
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

    if (!palletDetail.Time) {
      this.notificationService.error("Please select time");
    } else if (!palletDetail.DoneByIds || palletDetail.DoneByIds.length === 0) {
      this.notificationService.error("Please select Done By");
    } else {
      // Convert DoneByIds to an array of numbers
      palletDetail.DoneByIds = Array.isArray(palletDetail.DoneByIds)
        ? palletDetail.DoneByIds.map(id => Number(id))
        : [];

      if (this.editPalletDetailsId >= 0) {
        this.addedPalletPackingDetailsList[this.editPalletDetailsId] = palletDetail;
        this.editPalletDetailsId = -1;
      } else {
        this.addedPalletPackingDetailsList.push(palletDetail);
      }

      this.updateTotalCasesProduced();
      this.palletPackingDetails.clear();
      this.addPalletDetail();

      //  console.log("Added pallet details:", this.addedPalletPackingDetailsList);
    }
  }

  getUserNames(userIds: number[]): string {
    //  console.log('User IDs:', userIds);
    //  console.log('User Map:', this.userMap);
    if (!userIds || !Array.isArray(userIds)) {
      return 'Unknown';
    }
    return userIds.map(id => this.userMap.get(id) || 'Unknown').join(', ');
  }


  onEditDetail(detail: any, index: number) {
    // Populate form with the details of the selected row
    this.populateFormWithValues([detail]);
    // console.log("Editing detail:", detail);
    // Set the index for the edit operation
    this.editPalletDetailsId = index;
  }

  populateFormWithValues(data: any | any[]) {
    const dataArray = Array.isArray(data) ? data : [data];

    this.palletPackingDetails = this.palletPackingForm.get('palletPackingDetails') as FormArray;
    this.palletPackingDetails.clear();

    dataArray.forEach(dataItem => {
      const item = this.formBuilder.group({});
      item.addControl('PalletNo', this.formBuilder.control(dataItem.PalletNo || ''));
      item.addControl('Time', this.formBuilder.control(dataItem.Time || ''));

      // Ensure DoneByIds is an array of numbers
      const doneByIds = Array.isArray(dataItem.DoneByIds) ? dataItem.DoneByIds : [dataItem.DoneByIds];
      item.addControl('DoneByIds', this.formBuilder.control(doneByIds.map(Number)));

      this.palletPackingDetails.push(item);
    });

    // console.log("Populated PalletPackingDetails:", this.palletPackingDetails.controls);
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
      const invalidFields = this.checkInvalidFields();
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
    formValue.FinishedCasesOnIncompletePalletAtEnd = formValue.FinishedCasesOnIncompletePalletAtEnd ? formValue.FinishedCasesOnIncompletePalletAtEnd : null;
    const totalCases = this.palletPackingForm.controls.TotalCasesProduced.value;
    formValue.totalcases = totalCases;
     console.log(" formValue.FinishedCasesOnIncompletePalletAtEnd", formValue.FinishedCasesOnIncompletePalletAtEnd);
    const payload = this.transformData(formValue);

    // Log payload for debugging
    // console.log("Transformed Payload:", JSON.stringify(payload, null, 2));

    // Decide whether to create or update
    if (this.isEditMode) {
      this.updatePalletPacking(payload);
    } else {
      this.createPalletPacking(payload);
    }
  }

  checkInvalidFields() {
    const invalidFields = [];
    Object.keys(this.palletPackingForm.controls).forEach(field => {
      const control = this.palletPackingForm.get(field);
      if (control && control.invalid) {
        invalidFields.push(field);
      }
    });
    return invalidFields;
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
      SAPProductionOrderId: this.isEditMode ? this.palletPackingData.sapProductionOrderId : originalData.SAPProductionOrderId,
      ProductId: this.isEditMode ? this.palletPackingData.productId : originalData.ProductId,
      FinishedCasesOnIncompletePalletAtStart: originalData.FinishedCasesOnIncompletePalletAtStart,
      FinishedCasesOnIncompletePalletAtEnd: originalData.FinishedCasesOnIncompletePalletAtEnd,
      TotalCasesProduced: this.isEditMode ? originalData.totalcases : originalData.TotalCasesProduced,
      SupervisedBy: originalData.SupervisedBy,
      Notes: originalData.Notes,
      palletPackingDetails: detailsArray.map(details => ({
        PalletNo: details.PalletNo,
        Time: formatToDateTime(details.Time),
        DoneByIds: Array.isArray(details.DoneByIds)
          ? details.DoneByIds.join(',')
          : details.DoneByIds,
      }))
    };
  }

  cancel() {
  //  this.router.navigate(['/secure/masters', 'production-order']);
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
