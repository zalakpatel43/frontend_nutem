import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription, timeout } from 'rxjs';
import { WeightCheckService } from '../../weight-check/weight-check.service';
import { ToastrService } from 'ngx-toastr';
import { TrailerInspectionService } from '../trailer-inspection.service';
import { PermissionService } from 'src/app/core/service/permission.service';


@Component({
  selector: 'app-add-edit',
  // standalone: true,
  // imports: [],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class TrailerInspectionAddEditComponent implements OnInit, OnDestroy {
  trailerInspectionData: any;
  trailerInspectionId: number;
  isEditMode: boolean;
  trailerInspectionForm: UntypedFormGroup;
  routerSub: Subscription;
  isFormSubmitted: boolean;
  page: string = ApplicationPage.trailerInspection;
  permissions = PermissionType;
  error: string;
  companyList: any[] = [];
  vehicleTypeList: any[] = [];
  usersList: any[] = [];
  isFormError: boolean = false;

  IsViewPermission: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private weightCheckService: WeightCheckService,
    private notificationService: ToastrService, private trailerInspectionService: TrailerInspectionService,
    private permissionService: PermissionService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
    this.IsViewPermission = this.permissionService.hasPermission('Trailer Inspection (PER_TRAILERINSPECTION) - View');

  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params["id"]);
      this.createForm();
      if (this.isEditMode) {
        this.trailerInspectionId = params.id//+params["id"];
       // console.log("id",this.trailerInspectionId);
        this.getTrailerInspectionById();
      }
    });
  }

  private getTrailerInspectionById() {
    this.trailerInspectionService.getByIdTrailerInspection(this.trailerInspectionId)
      .subscribe((result: any) => {
        this.trailerInspectionData = result;
        this.setWeightCheckData();

        console.log("get by id data", result)
      },
        (error) => {
          console.log(error);
        });
  }

  private setWeightCheckData() {

    const formatTimeWithAMPM = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    this.trailerInspectionForm.patchValue({

      Code: this.trailerInspectionData.code,
      Date: this.trailerInspectionData.date, // Format date to yyyy-MM-dd
      CompanyId: this.trailerInspectionData.companyId,
      InspectedById: this.trailerInspectionData.inspectedById,
      TimeIn: formatTimeWithAMPM(this.trailerInspectionData.timeIn) , // Extract time in HH:mm format
      TimeOut: formatTimeWithAMPM(this.trailerInspectionData.timeOut) , // Extract time in HH:mm format
      TotalTime: this.trailerInspectionData.totalTime,
      TimeOfInspection: formatTimeWithAMPM(this.trailerInspectionData.timeOfInspection) , // Extract time in HH:mm format
      Mode: this.trailerInspectionData.mode,
      DriverName: this.trailerInspectionData.driverName,
      VehicleTypeId: this.trailerInspectionData.vehicleTypeId,
      LicensePlateNo: this.trailerInspectionData.licensePlateNo,
      TrailerNo: this.trailerInspectionData.trailerNo,
      TruckNo: this.trailerInspectionData.truckNo,
      VehicleStatus: this.trailerInspectionData.vehicleStatus,
      RejectionReason: this.trailerInspectionData.rejectionReason,
      VehicleCleanAns: this.trailerInspectionData.vehicleCleanAns,
      VehicleCleanNotes: this.trailerInspectionData.vehicleCleanNotes,
      ComingOrderFromForeignAns: this.trailerInspectionData.comingOrderFromForeignAns,
      ComingOrderFromForeignNotes: this.trailerInspectionData.comingOrderFromForeignNotes,
      DoorCloseProperlyAns: this.trailerInspectionData.doorCloseProperlyAns,
      DoorCloseProperlyNotes: this.trailerInspectionData.doorCloseProperlyNotes,
      OverallIntegrityAns: this.trailerInspectionData.overallIntegrityAns,
      OverallIntegrityNotes: this.trailerInspectionData.overallIntegrityNotes,
      FloorInGoodConditionAns: this.trailerInspectionData.floorInGoodConditionAns,
      FloorInGoodConditionNotes: this.trailerInspectionData.floorInGoodConditionNotes,
      PresentOnTrailerAns: this.trailerInspectionData.presentOnTrailerAns,
      PresentOnTrailerNotes: this.trailerInspectionData.presentOnTrailerNotes,
      SafeWorkingOrderAns: this.trailerInspectionData.safeWorkingOrderAns,
      SafeWorkingOrderNotes: this.trailerInspectionData.safeWorkingOrderNotes,
      IsRustPresentAns: this.trailerInspectionData.isRustPresentAns,
      IsRustPresentNotes: this.trailerInspectionData.isRustPresentNotes,
      TemperatureSettingUsedAns: this.trailerInspectionData.temperatureSettingUsedAns,
      TemperatureSettingUsedNotes: this.trailerInspectionData.temperatureSettingUsedNotes
    });

    this.trailerInspectionForm.get('TimeIn').disable();
    this.trailerInspectionForm.get('TimeOut').disable();
    this.trailerInspectionForm.get('TotalTime').disable();
    this.trailerInspectionForm.get('TimeOfInspection').disable();

  }


  private loadDropdowns() {

    this.trailerInspectionService.getComapnyList()
      .subscribe((result: any) => {
        this.companyList = result;
      });

    this.trailerInspectionService.getVehicleTypeList()
      .subscribe((result: any) => {
        this.vehicleTypeList = result;
      });

    this.weightCheckService.getUserList()
      .subscribe((result: any) => {
        this.usersList = result;
      });
  }

  createForm() {
    this.trailerInspectionForm = this.formBuilder.group({
      Code: [{ value: '', disabled: true }, [Validators.required]],
      Date: ['', [Validators.required]],
      CompanyId: ['', [Validators.required]],
      InspectedById: ['', [Validators.required]],
      TimeIn: ['', [Validators.required]],
      TimeOut: ['', [Validators.required]],
      TotalTime: ['', [Validators.required]],
      TimeOfInspection: ['', [Validators.required]],
      Mode: ['Outgoing', []],
      DriverName: ['', [Validators.required]],
      VehicleTypeId: ['', [Validators.required]],
      LicensePlateNo: ['', [Validators.required]],
      TrailerNo: ['', []],
      TruckNo: ['', []],
      VehicleStatus: ['Accepted', []],
      RejectionReason: ['', []],
      VehicleCleanAns: ['Pass', []],
      VehicleCleanNotes: ['', []],
      ComingOrderFromForeignAns: ['Pass', []],
      ComingOrderFromForeignNotes: ['', []],
      DoorCloseProperlyAns: ['Pass', []],
      DoorCloseProperlyNotes: ['', []],
      OverallIntegrityAns: ['Pass', []],
      OverallIntegrityNotes: ['', []],
      FloorInGoodConditionAns: ['Pass', []],
      FloorInGoodConditionNotes: ['', []],
      PresentOnTrailerAns: ['Pass', []],
      PresentOnTrailerNotes: ['', []],
      SafeWorkingOrderAns: ['Pass', []],
      SafeWorkingOrderNotes: ['', []],
      IsRustPresentAns: ['Pass', []],
      IsRustPresentNotes: ['', []],
      TemperatureSettingUsedAns: ['Pass', []],
      TemperatureSettingUsedNotes: ['', []]
    });
    this.trailerInspectionForm.controls["Date"].setValue(new Date().toISOString().split('T')[0]);
  }



  getToday() {
    return new Date().toISOString().split('T')[0];
  }


  OnTimeOut(event: any) {
    const timeIn = this.trailerInspectionForm.get('TimeIn').value;
    const timeOut = this.trailerInspectionForm.get('TimeOut').value;

    console.log("time in , timeout", timeIn, timeOut)

    if (!timeIn) {
      this.notificationService.error("select Time in ");
      this.trailerInspectionForm.get('TimeOut').setValue('');
      this.isFormError = true;
      return;
    }
    else if (timeIn && timeOut) {
      const start = this.parseTime(timeIn);
      const end = this.parseTime(timeOut);
      if (start >= end) {
        this.notificationService.error("Time out should be greater than Time in ");
        this.trailerInspectionForm.get('TimeOut').setValue('');
        this.isFormError = true;
        return;
      }
      else {
        if (start < end) {
          const durationMs = end - start;
          const durationMins = Math.floor(durationMs / (1000 * 60));
          const hours = Math.floor(durationMins / 60);
          const minutes = durationMins % 60;

          this.trailerInspectionForm.get('TotalTime').setValue(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
          this.isFormError = false;
        } else {
          this.trailerInspectionForm.get('TotalTime').setValue('');
          this.isFormError = true;
        }
      }
    }
  }

  OnInspectionTime(event) {
    const timeIn = this.trailerInspectionForm.get('TimeIn').value;
    const timeOut = this.trailerInspectionForm.get('TimeOut').value;
    const inspectionTime = this.trailerInspectionForm.get('TimeOfInspection').value;

    if (!timeIn) {
      this.notificationService.error("select Time in ");
      this.trailerInspectionForm.get('TimeOfInspection').setValue('');
      this.isFormError = true;
      return;
    }
    else if (!timeOut) {
      this.notificationService.error("select Time out ");
      this.trailerInspectionForm.get('TimeOfInspection').setValue('');
      this.isFormError = true;
      return;
    }
    else if (timeIn && timeOut) {
      const start = this.parseTime(timeIn);
      const end = this.parseTime(timeOut);
      const inspection = this.parseTime(inspectionTime);
      if (inspection < start) {
        this.notificationService.error("Inspection time should be greater than Time in ");
        this.trailerInspectionForm.get('TimeOfInspection').setValue('');
        this.isFormError = true;
        return;
      }
      else if (inspection > end) {
        this.notificationService.error("Inspection time should be less than Time out ");
        this.trailerInspectionForm.get('TimeOfInspection').setValue('');
        this.isFormError = true;
        return;
      }
      else if (inspection >= start && inspection <= end) {
        this.isFormError = false;
      } else {
        this.trailerInspectionForm.get('TimeOfInspection').setValue('');
        this.isFormError = true;
      }
    }
  }


  parseTime(timeStr: string): number {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
  }

  private createTrailerInspection(Playload) {
    this.trailerInspectionService.addTrailerInspection(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Trailer Inspection created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateTrailerInspection(Playload) {
    this.trailerInspectionService.updateTrailerInspection(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Trailer Inspection  updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    this.isFormSubmitted = true;
    // const endDate = this.WeightCheckForm.get('EndDateTime')?.value;
    // const startDate = this.WeightCheckForm.get('StartDateTime')?.value;

    if (this.trailerInspectionForm.invalid) {
      return;
    }
    else {
      let formvalue = this.trailerInspectionForm.value;
      console.log("formvalue", formvalue)
      let isValid: boolean = this.validateFOrm(formvalue);
     
      console.log("isValid", isValid)
      if (isValid) {
        let Playload = this.transformData(formvalue);
        console.log("Playload", Playload)

        if (this.isEditMode) {
          this.updateTrailerInspection(Playload);
        } else {
          this.createTrailerInspection(Playload);
        }
      }

    }
  }

  validateFOrm(formvalue): boolean {
    if (this.isFormError) {
      this.notificationService.error("please check time issue");
      return false;
    }
    if (formvalue.VehicleCleanAns === 'Fail' && formvalue.VehicleCleanNotes.trim().length == 0) {
      this.notificationService.error("enter Vehicle Clean Notes");
      return false;
    }
    if (formvalue.ComingOrderFromForeignAns === 'Fail' && formvalue.ComingOrderFromForeignNotes.trim().length == 0) {
      this.notificationService.error("enter Coming Order From Foreign  Notes");
      return false;
    }
    if (formvalue.DoorCloseProperlyAns === 'Fail' && formvalue.DoorCloseProperlyNotes.trim().length == 0) {
      this.notificationService.error("enter Door Close Properly Notes");
      return false;
    }
    if (formvalue.OverallIntegrityAns === 'Fail' && formvalue.OverallIntegrityNotes.trim().length == 0) {
      this.notificationService.error("enter Overall Integrity Notes");
      return false;
    }
    if (formvalue.FloorInGoodConditionAns === 'Fail' && formvalue.FloorInGoodConditionNotes.trim().length == 0) {
      this.notificationService.error("enter Floor In Good Condition Notes");
      return false;
    }
    if (formvalue.PresentOnTrailerAns === 'Fail' && formvalue.PresentOnTrailerNotes.trim().length == 0) {
      this.notificationService.error("enter Present On Trailer Notes");
      return false;
    }
    if (formvalue.SafeWorkingOrderAns === 'Fail' && formvalue.SafeWorkingOrderNotes.trim().length == 0) {
      this.notificationService.error("enter Safe Working Order Notes");
      return false;
    }
    if (formvalue.IsRustPresentAns === 'Fail' && formvalue.IsRustPresentNotes.trim().length == 0) {
      this.notificationService.error("enter Is Rust Present Notes");
      return false;
    }
    if (formvalue.TemperatureSettingUsedAns === 'Fail' && formvalue.TemperatureSettingUsedNotes.trim().length == 0) {
      this.notificationService.error("enter Temperature Setting Used Notes");
      return false;
    }
     if(formvalue.VehicleStatus === 'Rejected' && (formvalue.RejectionReason.length == 0 || !formvalue.RejectionReason.trim()) ){
        this.notificationService.error("Reason for Rejection required");
        return false;
     }
    return true;
  }

  transformData(formValue) {
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

   
    const result = {
      
      Id: this.isEditMode ? this.trailerInspectionData.id : 0,
      Code: this.isEditMode ? this.trailerInspectionData.code : '',
      Date: formatToDateTime(formValue.Date),
      CompanyId: formValue.CompanyId,
      InspectedById: formValue.InspectedById,
      TimeIn:this.isEditMode ? this.trailerInspectionData.timeIn : formatToTime(formValue.TimeIn),
      TimeOut: this.isEditMode ? this.trailerInspectionData.timeOut : formatToTime(formValue.TimeOut),
      TotalTime: this.isEditMode ? this.trailerInspectionData.totalTime : formValue.TotalTime.toString(),
      TimeOfInspection: this.isEditMode ? this.trailerInspectionData.timeOfInspection : formatToTime(formValue.TimeOfInspection),
      Mode: formValue.Mode,
      DriverName: formValue.DriverName,
      VehicleTypeId: formValue.VehicleTypeId,
      LicensePlateNo: formValue.LicensePlateNo || '',
      TrailerNo: formValue.TrailerNo || '',
      TruckNo: formValue.TruckNo || '',
      VehicleStatus: formValue.VehicleStatus,
      RejectionReason: formValue.RejectionReason,
      VehicleCleanAns: formValue.VehicleCleanAns,
      VehicleCleanNotes: formValue.VehicleCleanNotes,
      ComingOrderFromForeignAns: formValue.ComingOrderFromForeignAns,
      ComingOrderFromForeignNotes: formValue.ComingOrderFromForeignNotes,
      DoorCloseProperlyAns: formValue.DoorCloseProperlyAns,
      DoorCloseProperlyNotes: formValue.DoorCloseProperlyNotes,
      OverallIntegrityAns: formValue.OverallIntegrityAns,
      OverallIntegrityNotes: formValue.OverallIntegrityNotes,
      FloorInGoodConditionAns: formValue.FloorInGoodConditionAns,
      FloorInGoodConditionNotes: formValue.FloorInGoodConditionNotes,
      PresentOnTrailerAns: formValue.PresentOnTrailerAns,
      PresentOnTrailerNotes: formValue.PresentOnTrailerNotes,
      SafeWorkingOrderAns: formValue.SafeWorkingOrderAns,
      SafeWorkingOrderNotes: formValue.SafeWorkingOrderNotes,
      IsRustPresentAns: formValue.IsRustPresentAns,
      IsRustPresentNotes: formValue.IsRustPresentNotes,
      TemperatureSettingUsedAns: formValue.TemperatureSettingUsedAns,
      TemperatureSettingUsedNotes: formValue.TemperatureSettingUsedNotes
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
