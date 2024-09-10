import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { List } from '@app-models';
import { Subscription } from 'rxjs';
import { WeightCheckService } from '../weight-check.service';
import { ToastrService } from 'ngx-toastr';
//import { start } from 'repl';

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
  NozzleList: any[] = [];
  usersList: any[] = [];
  WeightCheckDetails: FormArray;
  AddedWeightCheckDetailsList: any[] = [];
  EditNozzleDetailsId: number = -1;
  minEndDate: Date | null = null;
trailerLoadingForm: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private weightCheckService: WeightCheckService,
    private notificationService: ToastrService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params["id"]);
      console.log("iseditmode", this.isEditMode)
      this.createForm();
      if (this.isEditMode) {
        this.weightCheckId = params.id//+params["id"];
        this.getWeightCheckById();
      }
    });
  }

  private getWeightCheckById() {
    this.weightCheckService.getByIdWeightCheck(this.weightCheckId)
      .subscribe((result: any) => {
        this.weightCheckData = result;
        this.setWeightCheckData();

        console.log("get by id data", result)
      },
        (error) => {
          console.log(error);
        });
  }

  private setWeightCheckData() {
    this.WeightCheckForm.patchValue({
      Code: this.weightCheckData.code,
      StartDateTime: this.weightCheckData.startDateTime,
      EndDateTime: this.weightCheckData.endDateTime,
      ShiftId: this.weightCheckData.shiftId,
      SAPProductionOrderId: this.weightCheckData.sapProductionOrderId,
      ProductId: this.weightCheckData.productId,
      BottleDateCode: this.weightCheckData.bottleDateCode,
      PackSize: this.weightCheckData.packSize,
      StandardWeight: this.weightCheckData.targetWeight,
      MinWeightRange: this.weightCheckData.minWeightRange,
      MaxWeightRange: this.weightCheckData.maxWeightRange,
      QAUserId: this.weightCheckData.qaUserId,
      Note: this.weightCheckData.note
    });
    this.WeightCheckForm.get('SAPProductionOrderId').disable();
    this.WeightCheckForm.get('ProductId').disable();

    const formatTimeWithAMPM = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    setTimeout(() => {
      this.weightCheckData.weightCheckDetails?.forEach(element => {
        const nozzleWeights: { [key: number]: number | string } = {};

        this.NozzleList.forEach(nozzle => {
          const detail = element.weightCheckSubDetails.find(d => d.nozzleId === nozzle.id);
          nozzleWeights[nozzle.id] = detail ? detail.weight ?? "" : "";
        });

        const doneByArray: number[] = element.doneByUserIds.split(',').map(item => Number(item.trim())).filter(value => !isNaN(value));

        console.log("nozzle weight ", nozzleWeights)
        let DetailsData = {
          Time: formatTimeWithAMPM(element.tDateTime),
          DoneBy: doneByArray,
          Average: element.avgWeight,
          Id: element.id,
          HeaderId: element.headerId,

        }

        Object.entries(nozzleWeights).forEach(([nozzleId, weight]) => {
          DetailsData[nozzleId] = weight;
        });

        this.AddedWeightCheckDetailsList.push(DetailsData);
      });
      console.log("added nozzle data", this.AddedWeightCheckDetailsList)
      //         let item :any;
    }, 500);


  }


  private loadDropdowns() {

    this.weightCheckService.getNozzleList()
      .subscribe((result: any) => {
        this.NozzleList = result.items;
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
      EndDateTime: ['', [Validators.required, this.endDateValidator]],
      ShiftId: ['', [Validators.required]],
      SAPProductionOrderId: ['', [Validators.required]],
      ProductId: ['', [Validators.required]],
      BottleDateCode: ['', [Validators.required]],
      PackSize: ['', [Validators.required]],
      StandardWeight: ['', [Validators.required]],
      MinWeightRange: ['', [Validators.required]],
      MaxWeightRange: ['', [Validators.required]],
      QAUserId: ['', [Validators.required]],
      Note: ['', ''],
      WeightCheckDetails: this.formBuilder.array([])
    });
    this.WeightCheckForm.controls["StartDateTime"].setValue(new Date().toISOString().split('T')[0]);
  }

  endDateValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const start = control.get('StartDateTime')?.value;
    const end = control.get('EndDateTime')?.value;
    return end && start && end < start ? { 'endDateBeforeStartDate': true } : null;
  };

  onStartDateChange() {
    const startDate = this.WeightCheckForm.get('StartDateTime')?.value;
    if (startDate) {
      this.minEndDate = new Date(startDate);
    } else {
      this.minEndDate = null;
    }
  }

  onEndDateChange() {
    const endDate = this.WeightCheckForm.get('EndDateTime')?.value;
    const startDate = this.WeightCheckForm.get('StartDateTime')?.value;
    if (!startDate) {
      this.notificationService.error("please select Start date")
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      this.notificationService.error("End date should be greated than Start date")
    } else {
      this.WeightCheckForm.get('EndDateTime')?.updateValueAndValidity();
    }
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }


  addWeightDetail() {
    this.WeightCheckDetails?.clear();
    this.EditNozzleDetailsId = -1;
    const item = this.formBuilder.group({});
    console.log("NozzleList", this.NozzleList)
    // Dynamically add NozzleName controls based on the API response
    this.NozzleList.forEach((nozzle, index) => {
      item.addControl(nozzle.nozzelName, this.formBuilder.control(""));
      //  this.NozzleNameList.push(nozzle.nozzelName);
    });

    // Add the remaining static controls
    item.addControl('Time', this.formBuilder.control(""));
    item.addControl('DoneBy', this.formBuilder.control(""));

    // Push the dynamically created item form group into the ItemList form array
    this.WeightCheckDetails = this.WeightCheckForm?.get('WeightCheckDetails') as FormArray;
    this.WeightCheckDetails.push(item);
    console.log("weightDeatilsList", this.WeightCheckDetails)
  }


  addFinalWeightDetail() {

    const weightDetail = this.WeightCheckDetails.at(0).value;

    if (!weightDetail.Time) {
      this.notificationService.error("please select time");
    }
    else if (!weightDetail.DoneBy) {
      this.notificationService.error("please select Done by");
    }
    else {
      if (this.EditNozzleDetailsId >= 0) {
        const average = this.calculateAverageForEntry(weightDetail);
        weightDetail.Average = average;
        this.AddedWeightCheckDetailsList[this.EditNozzleDetailsId] = weightDetail;
        this.addWeightDetail();
      }
      else {
        const average = this.calculateAverageForEntry(weightDetail);
        weightDetail.Average = average;
        this.AddedWeightCheckDetailsList.push(weightDetail);
        this.addWeightDetail();

        // Log the updated list with averages
        console.log("Added nozzle with average:", this.AddedWeightCheckDetailsList);
      }

    }

  }


  calculateAverageForEntry(entry: any): number {
    // Extract values for fields excluding 'time' and 'doneBy'
    const nozzleValues = Object.keys(entry)
      .filter(key => key !== 'Time' && key !== 'DoneBy' && key !== 'Average') // Exclude specific fields
      .map(key => parseFloat(entry[key])) // Convert values to numbers
      .filter(value => !isNaN(value)); // Filter out non-numeric values
    const total = nozzleValues.reduce((sum, value) => sum + value, 0);
    return nozzleValues.length ? total / nozzleValues.length : 0;
  }

  onEditDetail(weight, i) {
    console.log("weight", weight);
    console.log("i", i)
    console.log("details selected for edit", this.AddedWeightCheckDetailsList[i]);

    this.populateFormWithValues(this.AddedWeightCheckDetailsList[i]);
    this.EditNozzleDetailsId = i;
  }

  populateFormWithValues(data: any | any[]) {
    // Ensure data is in array format
    const dataArray = Array.isArray(data) ? data : [data];

    // Retrieve the FormArray
    this.WeightCheckDetails = this.WeightCheckForm.get('WeightCheckDetails') as FormArray;

    // Clear existing FormArray
    this.WeightCheckDetails.clear();

    // Populate each FormGroup in the FormArray
    dataArray.forEach(dataItem => {
      const item = this.formBuilder.group({});

      // Add Nozzle controls dynamically
      this.NozzleList.forEach(nozzle => {
        item.addControl(nozzle.nozzelName, this.formBuilder.control(dataItem[nozzle.nozzelName] || ''));
      });

      // Add static controls with data
      item.addControl('Time', this.formBuilder.control(dataItem.Time || ''));
      item.addControl('DoneBy', this.formBuilder.control(dataItem.DoneBy || ''));
      // item.addControl('Average', this.formBuilder.control(dataItem.Average || ''));

      // Push the populated FormGroup into the FormArray
      this.WeightCheckDetails.push(item);
    });

    console.log("Populated WeightCheckDetails:", this.WeightCheckDetails);
  }


  removeWeightDetail(i: number) {
    // const control = <FormArray>this.WeightCheckForm?.controls['ItemList'];
    // control.removeAt(i);

    this.AddedWeightCheckDetailsList.splice(i, 1);
    console.log("control", this.AddedWeightCheckDetailsList)
    console.log("items", this.AddedWeightCheckDetailsList);
  }



  private createWeightCheck(Playload) {

    this.weightCheckService.addWeightCheck(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Weight Check created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateWeightCheck(Playload) {
    this.weightCheckService.updateWeightCheck(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Weight Check updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    this.isFormSubmitted = true;
    const endDate = this.WeightCheckForm.get('EndDateTime')?.value;
    const startDate = this.WeightCheckForm.get('StartDateTime')?.value;

    if (this.WeightCheckForm.invalid) {
      return;
    }
    else if(new Date(endDate) <= new Date(startDate)){
      this.notificationService.error("End date should be greated than Start date")
      return;
    }
    else if (this.AddedWeightCheckDetailsList.length < 1) {
      this.notificationService.error("at lease one Nozzlewise deatils required");
      return;
    }
    else {
      let formvalue = this.WeightCheckForm.value;
      formvalue.WeightCheckDetails = this.AddedWeightCheckDetailsList;
      console.log("formvalue", formvalue)
      let Playload = this.transformData(formvalue);
      console.log("Playload", Playload)
      console.log("json stringyfy", JSON.stringify(Playload, null, 2))

      if (this.isEditMode) {
        this.updateWeightCheck(Playload);
      } else {
        this.createWeightCheck(Playload);
      }
    }
  }

  transformData(originalData) {
    // Helper function to format date
    function formatToDateTime(dateStr) {
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date string provided");
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function formatToTime(timeStr) {
      const timeRegex = /(\d{1,2}):(\d{2}) (AM|PM)/i;

      // Match the input time
      const match = timeStr.match(timeRegex);

      if (!match) {
        throw new Error('Invalid time format');
      }

      // Extract hour, minute, and period from the match
      let [, hourStr, minuteStr, period] = match;
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      // Convert hour based on AM/PM
      if (period.toUpperCase() === 'AM') {
        if (hour === 12) {
          hour = 0; // Midnight case
        }
      } else if (period.toUpperCase() === 'PM') {
        if (hour !== 12) {
          hour += 12; // Convert PM hour to 24-hour format
        }
      }

      // Format hour and minute with leading zeros
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');

      // Get the current date
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');

      // Construct the final output string
      const result = `${year}-${month}-${day}T${formattedHour}:${formattedMinute}`;

      return result;
    }

    const detailsArray = Array.isArray(originalData.WeightCheckDetails)
      ? originalData.WeightCheckDetails
      : Object.values(originalData.WeightCheckDetails || {});

    const result = {
      Id: this.isEditMode ? this.weightCheckData.id : 0,
      Code: this.isEditMode ? this.weightCheckData.code : "",
      StartDateTime: formatToDateTime(originalData.StartDateTime),
      EndDateTime: formatToDateTime(originalData.EndDateTime),
      SAPProductionOrderId: this.isEditMode ? this.weightCheckData.sapProductionOrderId : originalData.SAPProductionOrderId,
      ProductId: this.isEditMode ? this.weightCheckData.productId : originalData.ProductId,
      ShiftId: originalData.ShiftId,
      BottleDateCode: originalData.BottleDateCode.toString(), // Adjust if needed
      PackSize: originalData.PackSize.toString(), // Static value, update if needed
      TargetWeight: originalData.StandardWeight.toString(), // Static value, update if needed
      MinWeightRange: originalData.MinWeightRange,
      MaxWeightRange: originalData.MaxWeightRange,
      QAUserId: originalData.QAUserId, // Static value, update if needed
      Note: originalData.Note, // Capitalize first letter

      WeightCheckDetails: Array.isArray(detailsArray) ? detailsArray.map((details, index) => ({

        Id: 0,
        HeaderId: 0, // Static value, update if needed
        TDateTime: formatToTime(details.Time), // Assuming Time is the timestamp
        AvgWeight: details.Average,
        DoneByUserIdList: details.DoneBy,

        WeightCheckSubDetails: Object.entries(details)
          .filter(([key, value]) => key !== 'Average' && key !== 'Time' && key !== 'DoneBy')
          .map(([nozzleId, weight]) => ({
            Id: 0,
            DetailId: 0,
            NozzleId: Number(nozzleId), // Convert key to number
            Weight: weight !== "" ? weight : null
          }))
      })) : []
    };

    return result;
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
