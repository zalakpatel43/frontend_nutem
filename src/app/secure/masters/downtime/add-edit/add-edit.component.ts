  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { FormArray, FormBuilder, FormGroup, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
  import { Subscription } from 'rxjs';
  import { DowntimeTrackingService } from '../downtime.service';
  import { ToastrService } from 'ngx-toastr';

  @Component({
    selector: 'app-down-time',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.scss']
  })
  export class DowntimeTrackingAddEditComponent implements OnInit, OnDestroy {


    downtimeTrackingData: any;
    downtimeTrackingId: number;
    isEditMode: boolean;
    downtimeTrackingForm: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.downtimeTracking;
    permissions = PermissionType;
    error: string;
    productionOrderList: any[] = [];
    productList: any[] = [];
    causeList: any[] = [];
    downtimeTrackingDetails: FormArray;
    addedDowntimeTrackingDetailsList: any[] = [];

    editDetailsId: number = -1;
    fillingLineList: any[] = []; // List of filling lines
    shiftList: any[] = []; // List of shifts
    usersList: any[] = []; // List of users
    downtimeTrackingDetailsList: any;
    fb: any; 

    selectedDate: string | null = null;
    selectedTime: string | null = null;
    form: any;
  last: any;
    isFormError: boolean = false;
    constructor(private activatedRoute: ActivatedRoute, private router: Router,
      private formBuilder: FormBuilder, private downtimeTrackingService: DowntimeTrackingService,
      private notificationService: ToastrService) { }

    ngOnInit(): void {
      this.getRoute();
      this.loadDropdowns();
      
      this.form = this.fb.group({
        ProductionDateTime: ['', Validators.required],
        ProductionTime: ['', Validators.required]
      });
    }

    get ProductionDateTime() {
      return this.downtimeTrackingForm.controls.ProductionDateTime;
    }
    onDateChange(event: any): void {
      const date = event.value;
      const time = this.downtimeTrackingForm.get('ProductionTime')?.value;
      if (date && time) {
        this.downtimeTrackingForm.get('ProductionDateTime')?.setValue(`${date}T${time}`);
      }
    }
    private getRoute() {
      this.routerSub = this.activatedRoute.params.subscribe((params) => {
        this.isEditMode = !CommonUtility.isEmpty(params["id"]);
        this.createForm();
        this.addDowntimeDetail();
        if (this.isEditMode) {
          this.downtimeTrackingId = params.id;
          this.getDowntimeTrackingById();
        }
      });
    }

    private getDowntimeTrackingById() {
      this.downtimeTrackingService.getByIdDowntimeTracking(this.downtimeTrackingId)
        .subscribe((result: any) => {
          this.downtimeTrackingData = result;
          this.setDowntimeTrackingData();
        },
          (error) => {
            console.log(error);
          });
    }
    OnTimeOut(event: any) {
      const timeIn = this.downtimeTrackingForm.get('TimeIn')?.value;
      const timeOut = this.downtimeTrackingForm.get('TimeOut')?.value;
    
      console.log("time in , timeout", timeIn, timeOut);
    
      if (!timeIn) {
        this.notificationService.error("Select Time In.");
        this.downtimeTrackingForm.get('TimeOut')?.setValue('');
        this.isFormError = true;
        return;
      }
    
      if (!timeOut) {
        this.notificationService.error("Select Time Out.");
        this.isFormError = true;
        return;
      }
    
      const start = this.parseTime(timeIn);
      const end = this.parseTime(timeOut);
    
      if (start >= end) {
        this.notificationService.error("Time Out should be greater than Time In.");
        this.downtimeTrackingForm.get('TimeOut')?.setValue('');
        this.isFormError = true;
        return;
      }
    
      const durationMs = end - start;
      const durationMins = Math.floor(durationMs / (1000 * 60));
      const hours = Math.floor(durationMins / 60);
      const minutes = durationMins % 60;
    
      this.downtimeTrackingForm.get('TotalTime')?.setValue(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
      this.isFormError = false;
    }
parseTime(timeStr: string): number {
  const [time, modifier] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  let totalHours = hours;

  if (modifier === 'PM' && hours < 12) {
    totalHours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    totalHours = 0;
  }

  const date = new Date();
  date.setHours(totalHours, minutes, 0, 0);

  return date.getTime();
}

    get isDateTimeValid(): boolean {
      return this.selectedDate && this.selectedTime ? true : false;
    }
    private setDowntimeTrackingData() {
      this.downtimeTrackingForm.patchValue({
        Code: this.downtimeTrackingData.code,
        ProductionDateTime: this.downtimeTrackingData.productionDateTime,
        ProductId: this.downtimeTrackingData.productId,
        ProductionOrderId: this.downtimeTrackingData.ProductionOrderId,
        FillingLineId: this.downtimeTrackingData.FillingLineId,
        SAPProductionOrderId: this.downtimeTrackingData.sapProductionOrderId,
        productLineId: this.downtimeTrackingData.productLineId,
      });
    
      this.downtimeTrackingForm.get('ProductionOrderId').disable();
      this.downtimeTrackingForm.get('SAPProductionOrderId').disable();
      this.downtimeTrackingForm.get('productLineId').disable();
    
      const formatDate = (dateTime: string): string => {
        const date = new Date(dateTime);
        return date.toISOString().split('T')[0]; // Only date part
      };
    
      setTimeout(() => {
        this.downtimeTrackingData.downtimeTrackingDetails?.forEach(element => {
          // Ensure doneByUserIds is valid before processing
          const doneByArray: number[] = (element.doneByUserIds || '').split(',').map(item => Number(item.trim())).filter(value => !isNaN(value));
          const formatTimeWithAMPM = (dateTime: string): string => {
            const date = new Date(dateTime);
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
          };
          let DetailsData = {
            StartDate: formatDate(element.startDate),
            EndDate: formatDate(element.endDate),
            TimeIn: formatTimeWithAMPM(this.downtimeTrackingData.timeIn) , // Extract time in HH:mm format
            TimeOut: formatTimeWithAMPM(this.downtimeTrackingData.timeOut) , // Extract time in HH:mm format
            TotalTime: this.downtimeTrackingData.totalTime,
            Durations: element.durations,
            CauseId: element.causeId,
            ShiftId: element.shiftId,
            ActionTaken: element.actionTaken,
            DoneByUserIds: doneByArray,
            IsActive: element.isActive
          };
    
          this.addedDowntimeTrackingDetailsList.push(DetailsData);
        });
      }, 500);
    }
    
    shiftMap: Map<number, string> = new Map();
    causeMap: Map<number, string> = new Map();
    userMap: Map<number, string> = new Map();

    private loadDropdowns() {
      this.downtimeTrackingService.getProductionOrderList()
        .subscribe((result: any) => {
          this.productionOrderList = result;
          console.log('Data', this,this.productionOrderList)
        });

      this.downtimeTrackingService.getProductList()
        .subscribe((result: any) => {
          this.productList = result;
        });

        this.downtimeTrackingService.getCauseList()
        .subscribe((result: any) => {
          this.causeList = result;
          this.causeMap = new Map(result.map(cause => [cause.id, cause.causeName]));
        });
      this.downtimeTrackingService.getMaster()
        .subscribe((result: any) => {
          this.fillingLineList = this.filterFillingLines(result);
        });
  
        this.downtimeTrackingService.getUserList()
        .subscribe((result: any) => {
          this.usersList = result;
          this.userMap = new Map(result.map(user => [user.id, user.name]));
        });


        this.downtimeTrackingService.getShiftList()
        .subscribe((result: any) => {
          this.shiftList = result;
          this.shiftMap = new Map(result.map(shift => [shift.id, shift.shiftName]));
        });


    }
    filterFillingLines(data: any[]): any[] {
      return data.filter((item) =>
        item.categoryName && item.categoryName.toLowerCase().indexOf('fill') !== -1
      );
    }

    createForm() {
      this.downtimeTrackingForm = this.formBuilder.group({
        Code: [{ value: '', disabled: true }, Validators.required],
        ProductionDateTime: ['', Validators.required],
        ProductId: ['', Validators.required],
        FillingLineId: [''],
        DoneByUserIds: [''],
        TimeIn: ['', Validators.required],
        TimeOut: ['', Validators.required],
        TotalTime: [''],
        SAPProductionOrderId: [''],
        ProductionOrderId: [''],
        productLineId: [''],
        downtimeTrackingDetails: this.formBuilder.array([])
      });
    }

    addDowntimeDetail() {
      this.downtimeTrackingDetails?.clear();
      this.editDetailsId = -1;

      const downtimeTrackingItem = this.formBuilder.group({
        StartDate: [''],
        EndDate: [''],
        Durations: [''],
        TimeIn: ['', [Validators.required]],
       TimeOut: ['' ,Validators.required] , // Ensure it's initialized
        TotalTime: ['', [Validators.required]],
        CauseId: [''],
        ActionTaken: [''],
        DoneByUserIds: [''],
        ShiftId: ['']
      });

      this.downtimeTrackingDetails = this.downtimeTrackingForm?.get('downtimeTrackingDetails') as FormArray;
      this.downtimeTrackingDetails.push(downtimeTrackingItem);
    }
    
    OnInspectionTime(event: any) {
      const timeIn = this.downtimeTrackingForm.get('TimeIn')?.value;
      const timeOut = this.downtimeTrackingForm.get('TimeOut')?.value;
      const inspectionTime = this.downtimeTrackingForm.get('TimeOfInspection')?.value;
    
      console.log("time in, timeout, inspection time", timeIn, timeOut, inspectionTime);
    
      if (!timeIn) {
        this.notificationService.error("Select Time In.");
        this.downtimeTrackingForm.get('TimeOfInspection')?.setValue('');
        this.isFormError = true;
        return;
      }
    
      if (!timeOut) {
        this.notificationService.error("Select Time Out.");
        this.downtimeTrackingForm.get('TimeOfInspection')?.setValue('');
        this.isFormError = true;
        return;
      }
    
      if (!inspectionTime) {
        this.notificationService.error("Select Inspection Time.");
        this.isFormError = true;
        return;
      }
    
      const start = this.parseTime(timeIn);
      const end = this.parseTime(timeOut);
      const inspection = this.parseTime(inspectionTime);
    
      if (inspection < start) {
        this.notificationService.error("Inspection Time should be greater than Time In.");
        this.downtimeTrackingForm.get('TimeOfInspection')?.setValue('');
        this.isFormError = true;
        return;
      }
    
      if (inspection > end) {
        this.notificationService.error("Inspection Time should be less than Time Out.");
        this.downtimeTrackingForm.get('TimeOfInspection')?.setValue('');
        this.isFormError = true;
        return;
      }
    
      this.isFormError = false;
    }

    addFinalDowntimeDetail() {
      const detail = this.downtimeTrackingDetails.at(0).value;
    
      if (!detail.StartDate || !detail.EndDate) {
        this.notificationService.error("Start Date and End Date are required");
        return;
      }
    
      if (this.editDetailsId >= 0) {
        // Update existing detail
        this.addedDowntimeTrackingDetailsList[this.editDetailsId] = { ...detail, IsActive: true };
        this.editDetailsId = -1; // Reset edit ID after updating
      } else {
        // Add new detail
        this.addedDowntimeTrackingDetailsList.push({ ...detail, IsActive: true });
      }
    
      // Clear form controls and add a new empty form group
      this.downtimeTrackingDetails.clear();
      this.addDowntimeDetail();
    }
    

    onEditDetail(detail: any, index: number) {
      // Populate the form with the selected detail
      this.populateFormWithValues([detail]);
    
      // Set the ID of the item being edited
      this.editDetailsId = index;
    }
    

    private populateFormWithValues(data: any) {
      const dataArray = Array.isArray(data) ? data : [data];
    
      this.downtimeTrackingDetails = this.downtimeTrackingForm.get('downtimeTrackingDetails') as FormArray;
      this.downtimeTrackingDetails.clear();
    
      dataArray.forEach(dataItem => {
        const item = this.formBuilder.group({
          StartDate: [dataItem.StartDate || ''],
          EndDate: [dataItem.EndDate || ''],
          Timein:[dataItem.TimeIn ||''],
          TimeOut:[dataItem.TimeOut || ''],
          TotalTime: [dataItem.TotalTime || ''],
          Durations: [dataItem.Durations || ''],
          CauseId: [dataItem.CauseId || ''],
          ShiftId: [dataItem.ShiftId || ''],
          ActionTaken: [dataItem.ActionTaken || ''],
          DoneByUserIds: [dataItem.DoneByUserIds || []],
          IsActive: [dataItem.IsActive || true]
        });
    
        this.downtimeTrackingDetails.push(item);
      });
    }
    

    removeDowntimeDetail(i: number) {
      this.addedDowntimeTrackingDetailsList.splice(i, 1);
    }
    save() {
      this.isFormSubmitted = true;

      if (this.downtimeTrackingForm.invalid) {
        this.notificationService.error('Please fill out all required fields.');
        return;
      }

      if (this.addedDowntimeTrackingDetailsList.length === 0) {
        this.notificationService.error('At least one downtime detail is required.');
        return;
      }

      const formValue = this.downtimeTrackingForm.value;
      formValue.downtimeTrackingDetails = this.addedDowntimeTrackingDetailsList;

      const payload = this.transformData(formValue);
      console.log('Transformed Payload:', payload);

      if (this.isEditMode) {
        this.updateDowntimeTracking(payload);
      } else {
        this.createDowntimeTracking(payload);
      }

      // After saving, clear the form and details list
      this.downtimeTrackingForm.reset();
      this.addedDowntimeTrackingDetailsList = [];
      this.addDowntimeDetail(); // Ensure at least one empty detail row exists
    }

    transformData(originalData: any) {
      // Add console log to debug the data
      console.log('Original Data:', originalData);

      function formatToDateTime(dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date string provided");
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
      }

      const detailsArray = Array.isArray(originalData.downtimeTrackingDetails)
        ? originalData.downtimeTrackingDetails
        : [];
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
          }}
      const result = {
        id: this.isEditMode ? this.downtimeTrackingData.id : 0,
        code: this.isEditMode ? this.downtimeTrackingData.code : "",
        productionDateTime: formatToDateTime(originalData.ProductionDateTime),
        productId: this.isEditMode ? this.downtimeTrackingData.productId : originalData.ProductId,
        productName: this.isEditMode ? this.downtimeTrackingData.productName : "string",
        productLineId: this.isEditMode ? this.downtimeTrackingData.productLineId : originalData.productLineId,
        productLineName: this.isEditMode ? this.downtimeTrackingData.productLineName : "string",
        isActive: true,
        SAPProductionOrderId: this.isEditMode ? this.downtimeTrackingData.sapProductionOrderId : originalData.SAPProductionOrderId,
        downtimeTrackingDetails: detailsArray.map(detail => ({
          id: detail.id || 0,
          headerId: this.isEditMode ? this.downtimeTrackingData.id : 0,
          startDate: formatToDateTime(detail.StartDate),
          endDate: formatToDateTime(detail.EndDate),
          timeIn:this.isEditMode ? this.downtimeTrackingData.timeIn : formatToTime(originalData.TimeIn),
          timeOut: this.isEditMode ? this.downtimeTrackingData.timeOut : formatToTime(originalData.TimeOut),
          durations: detail.Durations,
          TotalTime: this.isEditMode ? this.downtimeTrackingData.totalTime : originalData.TotalTime.toString(),
          causeId: detail.CauseId, // Ensure CauseId is a number
          shiftId: detail.ShiftId, // Ensure ShiftId is a number
          actionTaken: detail.ActionTaken,
          doneByUserIds: (Array.isArray(detail.DoneByUserIds) ? detail.DoneByUserIds.join(',') : detail.DoneByUserIds) || '', // Convert array to comma-separated string
          doneByUserNames: '', // Assuming you want to set this to an empty string
          isActive: detail.IsActive || true
      }))
      };

      return result;
    }

    private createDowntimeTracking(payload: any) {
      console.log('Creating Downtime Tracking:', payload);
      this.downtimeTrackingService.addDowntimeTracking(payload)
        .subscribe(
          (response) => {
            console.log('Create Response:', response);
            // You may want to navigate or refresh data based on response
            this.cancel();
            this.notificationService.success("Downtime Tracking created successfully.");
          },
          (error) => {
            console.error('Error creating Downtime Tracking:', error);
            this.error = error;
            this.notificationService.error('Failed to create Downtime Tracking.');
          }
        );
    }

    private updateDowntimeTracking(payload: any) {
      console.log('Updating Downtime Tracking:', payload);
      this.downtimeTrackingService.updateDowntimeTracking(payload)
        .subscribe(
          (response) => {
            console.log('Update Response:', response);
            this.cancel();
            this.notificationService.success("Downtime Tracking updated successfully.");
          },
          (error) => {
            console.error('Error updating Downtime Tracking:', error);
            this.error = error;
            this.notificationService.error('Failed to update Downtime Tracking.');
          }
        );
    }

    ngOnDestroy(): void {
      if (this.routerSub) {
        this.routerSub.unsubscribe();
      }
    }
    cancel() {
      if (this.isEditMode) {
        this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
      } else {
        this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
      }
    }

  }