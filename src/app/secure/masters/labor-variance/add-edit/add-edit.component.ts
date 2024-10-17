import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { LaborVarianceService } from '../labor-variance.service';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from '../../permission/permission.service';
import { WeightCheckService } from '../../weight-check/weight-check.service';
import { DowntimeTrackingService } from '../../downtime/downtime.service';

@Component({
  selector: 'app-add-edit',
  // standalone: true,
  // imports: [],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class LaborVarianceAddEditComponent implements OnInit, OnDestroy {
  laborVarianceData: any;
  laborVarianceId: number;
  isEditMode: boolean;
  laborVarianceForm: UntypedFormGroup;
  routerSub: Subscription;
  isFormSubmitted: boolean;
  page: string = ApplicationPage.laborVariance;
  permissions = PermissionType;
  error: string;
  shiftList: any[] = [];
  productionOrderList: any[] = [];
  productList: any[] = [];
  fillingLineList: any[] = [];
  usersList: any[] = [];
  LaborVarianceDetails: FormArray;
  AddedlaborVarianceDetailsList: any[] = [];
  EditDetailsId: number = -1;
  minEndDate: Date | null = null;

  IsViewPermission: boolean = true;
  TotalEmployee: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private laborVarinceService: LaborVarianceService,
    private notificationService: ToastrService, private weightCheckService: WeightCheckService,
    private permissionService: PermissionService, private downtimeTrackingService: DowntimeTrackingService) {
    this.createForm();
  }

  ngOnInit(): void {

    this.getRoute();
    this.loadDropdowns();
    // this.IsViewPermission = this.permissionService.hasPermission('Weight Check (PER_WEIGHTCHECK) - View');

  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params["id"]);
      //  console.log("iseditmode", this.isEditMode)
      this.createForm();
      this.addlaborDetail();
      if (this.isEditMode) {
        this.laborVarianceId = params.id//+params["id"];
        this.getlaborVarianceById();
      }
    });
  }

  private getlaborVarianceById() {
    this.laborVarinceService.getByIdLaborVariance(this.laborVarianceId)
      .subscribe((result: any) => {
        this.laborVarianceData = result;
        this.setlaborVariancekData();

        //  console.log("get by id data", result)
      },
        (error) => {
          console.log(error);
        });
  }

  private setlaborVariancekData() {
    this.laborVarianceForm.patchValue({
      Code: this.laborVarianceData.code,
      DateTime: this.laborVarianceData.dateTime,
      ShiftId: this.laborVarianceData.shiftId,
      ProductLineId: this.laborVarianceData.productLineId,
      Employees: this.laborVarianceData.employees,
      TempEmployee: this.laborVarianceData.tempEmployee,
      TotalEmployee: this.laborVarianceData.totalEmployee,
      Note: this.laborVarianceData.note
    });

    const formatTimeWithAMPM = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    setTimeout(() => {
      this.laborVarianceData.laborVarianceDetails?.forEach(element => {
       
        // console.log("done by array", doneByArray);
        let DetailsData = {
          SAPProductionOrderId: element.sapProductionOrderId,
          ProductId: element.productId,
          StartDateTime: formatTimeWithAMPM(element.startDateTime),
          EndDateTime: formatTimeWithAMPM(element.endDateTime),
          LateStartReason: element.lateStartReason,
          ChangeOverTime: formatTimeWithAMPM(element.changeOverTime),
          ActualBottleProduced: element.actualBottleProduced,
          TotalRunTImeMins: element.totalRunTImeMins,
          ShiftComments: element.shiftComments,
          DownTimeMins: element.downTimeMins,
          DownTImeComments: element.downTImeComments,
          HC: element.hc,
          CaseAttainment: element.caseAttainment,
          CaseTarget: element.caseTarget,
          Percentage: element.percentage,
          BottleTarget: element.bottleTarget,
          ShiftIndex: element.shiftIndex,
          Criteria: element.criteria,
          MissingFGItems: element.missingFGItems,
          NonProductionTime: element.nonProductionTime,
          AdditionalComments: element.additionalComments,
          TimePerPerson: element.timePerPerson,
          TotalMins: element.totalMins,
          Description: element.description
        }

        this.AddedlaborVarianceDetailsList.push(DetailsData);
      });
    }, 500);


  }


  private loadDropdowns() {
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

    this.downtimeTrackingService.getMaster()
      .subscribe((result: any) => {
        this.fillingLineList = this.filterFillingLines(result);
      });
  }

  filterFillingLines(data: any[]): any[] {
    return data.filter((item) =>
      item.categoryName && item.categoryName.toLowerCase().indexOf('fill') !== -1
    );
  }

  createForm() {
    this.laborVarianceForm = this.formBuilder.group({
      Code: [{ value: '', disabled: true }, [Validators.required]],
      DateTime: ['', [Validators.required]],
      ShiftId: ['', [Validators.required]],
      ProductLineId: ['', [Validators.required]],
      Employees: ['', [Validators.required]],
      TempEmployee: ['', [Validators.required]],
      TotalEmployee: ['', ''],
      Note: ['', ''],
      LaborVarianceDetails: this.formBuilder.array([])
    });
    this.laborVarianceForm.controls["DateTime"].setValue(new Date().toISOString().split('T')[0]);

    this.laborVarianceForm.get('Employees')?.valueChanges.subscribe(() => {
      this.updateTotalEmployees();
    });

    this.laborVarianceForm.get('TempEmployee')?.valueChanges.subscribe(() => {
      this.updateTotalEmployees();
    });
  }

  updateTotalEmployees() {
    const employees = this.laborVarianceForm.get('Employees')?.value || 0;
    const tempEmployees = this.laborVarianceForm.get('TempEmployee')?.value || 0;
    this.TotalEmployee = employees + tempEmployees;
    this.laborVarianceForm.get('TotalEmployee')?.setValue(this.TotalEmployee, { emitEvent: false }); // Emit false to avoid triggering valueChanges again
    this.LaborVarianceDetails.at(0).get('HC')?.setValue(this.TotalEmployee, { emitEvent: false });
  }

  

  getToday() {
    return new Date().toISOString().split('T')[0];
  }


  addlaborDetail() {
    this.LaborVarianceDetails?.clear();
    this.EditDetailsId = -1;
    const laborVarinceItem = this.formBuilder.group({});

    // Add controls dynamically without validators
    laborVarinceItem.addControl('SAPProductionOrderId', this.formBuilder.control(''));
    laborVarinceItem.addControl('ProductId', this.formBuilder.control(''));
    laborVarinceItem.addControl('StartDateTime', this.formBuilder.control(''));
    laborVarinceItem.addControl('EndDateTime', this.formBuilder.control(''));
    laborVarinceItem.addControl('LateStartReason', this.formBuilder.control(''));
    laborVarinceItem.addControl('ChangeOverTime', this.formBuilder.control(''));
    laborVarinceItem.addControl('ActualBottleProduced', this.formBuilder.control(''));
    laborVarinceItem.addControl('TotalRunTImeMins', this.formBuilder.control(''));
    laborVarinceItem.addControl('ShiftComments', this.formBuilder.control(''));
    laborVarinceItem.addControl('DownTimeMins', this.formBuilder.control(''));
    laborVarinceItem.addControl('DownTImeComments', this.formBuilder.control(''));
    laborVarinceItem.addControl('HC', this.formBuilder.control(this.TotalEmployee || ''));
    laborVarinceItem.addControl('CaseAttainment', this.formBuilder.control(''));
    laborVarinceItem.addControl('CaseTarget', this.formBuilder.control(''));
    laborVarinceItem.addControl('Percentage', this.formBuilder.control(''));
    laborVarinceItem.addControl('BottleTarget', this.formBuilder.control(''));
    laborVarinceItem.addControl('ShiftIndex', this.formBuilder.control(''));
    laborVarinceItem.addControl('Criteria', this.formBuilder.control(''));
    laborVarinceItem.addControl('MissingFGItems', this.formBuilder.control(''));
    laborVarinceItem.addControl('NonProductionTime', this.formBuilder.control(''));
    laborVarinceItem.addControl('AdditionalComments', this.formBuilder.control(''));
    laborVarinceItem.addControl('TimePerPerson', this.formBuilder.control(''));
    laborVarinceItem.addControl('TotalMins', this.formBuilder.control(''));
    laborVarinceItem.addControl('Description', this.formBuilder.control(''));

    //laborVarinceItem.get('HC')?.setValue(this.TotalEmployee);


    // Get the FormArray from the parent form
    this.LaborVarianceDetails = this.laborVarianceForm?.get('LaborVarianceDetails') as FormArray;

    // Push the newly created FormGroup into the FormArray
    this.LaborVarianceDetails.push(laborVarinceItem);

    this.LaborVarianceDetails.at(0).get('CaseAttainment')?.valueChanges.subscribe(() => {
      this.updatePercentage();
    });

    this.LaborVarianceDetails.at(0).get('HC')?.valueChanges.subscribe(() => {
      this.updatePercentage();
    });
  }

  updatePercentage() {
    const caseAttainment = this.LaborVarianceDetails.at(0).get('CaseAttainment')?.value || 0;
    const totalEmployees = this.TotalEmployee || 0;

    const percentage = totalEmployees ? (caseAttainment / totalEmployees).toFixed(2) : 0 // totalEmployees ? (caseAttainment / totalEmployees) * 100 : 0; 
    this.LaborVarianceDetails.at(0).get('Percentage')?.setValue(percentage);

  }


  addFinallaborVarianceDetail() {

    const laborDetail = this.LaborVarianceDetails.at(0).value;

    if (!laborDetail.SAPProductionOrderId) {
      this.notificationService.error("please select production order");
    }
    else if (!laborDetail.ProductId) {
      this.notificationService.error("please select product");
    }
    else {
      if (this.EditDetailsId >= 0) {
        this.AddedlaborVarianceDetailsList[this.EditDetailsId] = laborDetail;
        this.addlaborDetail();
      }
      else {
        this.AddedlaborVarianceDetailsList.push(laborDetail);
        this.addlaborDetail();

       // console.log("Added lavbor details:", this.AddedlaborVarianceDetailsList);
      }

    }

  }

  onEditDetail(weight, i) {
    this.populateFormWithValues(this.AddedlaborVarianceDetailsList[i]);
    this.EditDetailsId = i;
  }

  populateFormWithValues(data: any | any[]) {
    const dataArray = Array.isArray(data) ? data : [data];

    this.LaborVarianceDetails = this.laborVarianceForm.get('LaborVarianceDetails') as FormArray;

    this.LaborVarianceDetails.clear();

    dataArray.forEach(dataItem => {
      const item = this.formBuilder.group({});

      // Add static controls with data
      item.addControl('SAPProductionOrderId', this.formBuilder.control(dataItem.SAPProductionOrderId || ''));
      item.addControl('ProductId', this.formBuilder.control(dataItem.ProductId || ''));
      item.addControl('StartDateTime', this.formBuilder.control(dataItem.StartDateTime || ''));
      item.addControl('EndDateTime', this.formBuilder.control(dataItem.EndDateTime || ''));
      item.addControl('LateStartReason', this.formBuilder.control(dataItem.LateStartReason || ''));
      item.addControl('ChangeOverTime', this.formBuilder.control(dataItem.ChangeOverTime || ''));
      item.addControl('ActualBottleProduced', this.formBuilder.control(dataItem.ActualBottleProduced || ''));
      item.addControl('TotalRunTImeMins', this.formBuilder.control(dataItem.TotalRunTImeMins || ''));
      item.addControl('ShiftComments', this.formBuilder.control(dataItem.ShiftComments || ''));
      item.addControl('DownTimeMins', this.formBuilder.control(dataItem.DownTimeMins || ''));
      item.addControl('DownTImeComments', this.formBuilder.control(dataItem.DownTImeComments || ''));
      item.addControl('HC', this.formBuilder.control(dataItem.HC || ''));
      item.addControl('CaseAttainment', this.formBuilder.control(dataItem.CaseAttainment || ''));
      item.addControl('CaseTarget', this.formBuilder.control(dataItem.CaseTarget || ''));
      item.addControl('Percentage', this.formBuilder.control(dataItem.Percentage || ''));
      item.addControl('BottleTarget', this.formBuilder.control(dataItem.BottleTarget || ''));
      item.addControl('ShiftIndex', this.formBuilder.control(dataItem.ShiftIndex || ''));
      item.addControl('Criteria', this.formBuilder.control(dataItem.Criteria || ''));
      item.addControl('MissingFGItems', this.formBuilder.control(dataItem.MissingFGItems || ''));
      item.addControl('NonProductionTime', this.formBuilder.control(dataItem.NonProductionTime || ''));
      item.addControl('AdditionalComments', this.formBuilder.control(dataItem.AdditionalComments || ''));
      item.addControl('TimePerPerson', this.formBuilder.control(dataItem.TimePerPerson || ''));
      item.addControl('TotalMins', this.formBuilder.control(dataItem.TotalMins || ''));
      item.addControl('Description', this.formBuilder.control(dataItem.Description || ''));


      // Push the populated FormGroup into the FormArray
      this.LaborVarianceDetails.push(item);

      this.LaborVarianceDetails.at(0).get('CaseAttainment')?.valueChanges.subscribe(() => {
        this.updatePercentage();
      });

      this.LaborVarianceDetails.at(0).get('HC')?.valueChanges.subscribe(() => {
        this.updatePercentage();
      });
    });

    // console.log("Populated WeightCheckDetails:", this.WeightCheckDetails);
  }


  removeLaborVarianceDetail(i: number) {
    this.AddedlaborVarianceDetailsList.splice(i, 1);
   // console.log("control", this.AddedlaborVarianceDetailsList)
  }



  private createLaborVariance(Playload) {
    this.laborVarinceService.addLaborVariance(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Labor Variance created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateLaborVariance(Playload) {
    this.laborVarinceService.updateLaborVariance(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Labor  Variance updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    this.isFormSubmitted = true;

    if (this.laborVarianceForm.invalid) {
      this.notificationService.error("Invalid form data");
      return;
    }
    else if (this.AddedlaborVarianceDetailsList.length < 1) {
      this.notificationService.error("at lease one labor variance deatils required");
      return;
    }
    else {
      let formvalue = this.laborVarianceForm.value;
      formvalue.LaborVarianceDetails = this.AddedlaborVarianceDetailsList;
      console.log("formvalue", formvalue)
      let Playload = this.transformData(formvalue);
      console.log("Playload", Playload)
      // console.log("json stringyfy", JSON.stringify(Playload, null, 2))

      if (this.isEditMode) {
        this.updateLaborVariance(Playload);
      } else {
        this.createLaborVariance(Playload);
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

    const detailsArray = Array.isArray(originalData.LaborVarianceDetails)
      ? originalData.LaborVarianceDetails
      : Object.values(originalData.LaborVarianceDetails || {});

    const result = {

      Id: this.isEditMode ? this.laborVarianceData.id : 0,
      Code: this.isEditMode ? this.laborVarianceData.code : "",
      DateTime: formatToDateTime(originalData.DateTime),
      ShiftId: originalData.ShiftId,
      ProductLineId: originalData.ProductLineId,
      Employees: originalData.Employees,
      TempEmployee: originalData.TempEmployee,
      TotalEmployee: originalData.TotalEmployee,
      Note: originalData.Note,
      LaborVarianceDetails: Array.isArray(detailsArray) ? detailsArray.map((details, index) => ({

        id: 0,
        headerId: 0,
        SAPProductionOrderId: details.SAPProductionOrderId,
        ProductId: details.ProductId,
        StartDateTime: formatToTime(details.StartDateTime),
        EndDateTime: formatToTime(details.EndDateTime),
        LateStartReason: details.LateStartReason,
        ChangeOverTime: formatToTime(details.ChangeOverTime),
        ActualBottleProduced: details.ActualBottleProduced,
        TotalRunTImeMins: details.TotalRunTImeMins,
        ShiftComments: details.ShiftComments,
        DownTimeMins: details.DownTimeMins,
        DownTImeComments: details.DownTImeComments,
        HC: details.HC,
        CaseAttainment: details.CaseAttainment,
        CaseTarget: details.CaseTarget,
        Percentage: Number(details.Percentage),
        BottleTarget: details.BottleTarget,
        ShiftIndex: details.ShiftIndex,
        Criteria: details.Criteria,
        MissingFGItems: details.MissingFGItems,
        NonProductionTime: details.NonProductionTime,
        AdditionalComments: details.AdditionalComments,
        TimePerPerson: details.TimePerPerson,
        TotalMins: details.TotalMins,
        Description: details.Description
      })) : []
    };

    return result;
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
    this.routerSub.unsubscribe();
  }
}

