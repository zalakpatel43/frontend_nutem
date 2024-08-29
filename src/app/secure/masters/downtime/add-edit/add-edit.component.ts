import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { DowntimeTrackingService } from '../downtime.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
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
  AddedDowntimeTrackingDetailsList: any[] = [];
  EditDetailsId: number = -1;
  causeList: any[] = [];
  actionTakenByList: any;
  Master: any[] = [];
  shiftList: any;
  fillingLineList: any;
  usersList: any[] = [];
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private downtimeTrackingService: DowntimeTrackingService,
    private notificationService: ToastrService) { }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
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

  private setDowntimeTrackingData() {
    this.downtimeTrackingForm.patchValue({
      DowntimeDate: this.downtimeTrackingData.downtimeDate,
      ProductionOrderId: this.downtimeTrackingData.productionOrderId,
      ProductId: this.downtimeTrackingData.productName,
    });

    // Populate the form array with existing details
    this.AddedDowntimeTrackingDetailsList = this.downtimeTrackingData.downtimeTrackingDetails || [];
    this.populateFormArray(this.AddedDowntimeTrackingDetailsList);
  }

  private loadDropdowns() {
    this.downtimeTrackingService.getProductionOrderList()
      .subscribe((result: any) => {
        this.productionOrderList = result;
      });

    this.downtimeTrackingService.getProductList()
      .subscribe((result: any) => {
        this.productList = result;
      });
    this.downtimeTrackingService.getCauseList()
      .subscribe((result: any) => {
        this.causeList = result;
      });
      this.downtimeTrackingService.getUserList()
      .subscribe((result: any) => {
        this.usersList = result;
      });
      this.downtimeTrackingService.getMaster()
      .subscribe((result: any) => {
        this.fillingLineList = this.filterFillingLines(result);
      });
    
   
      
    this.downtimeTrackingService.getShiftList()
    .subscribe((result: any) => {
      this.shiftList = result;
    });

  }
  filterFillingLines(data: any[]): any[] {
    return data.filter((item) =>
      item.categoryName && item.categoryName.toLowerCase().indexOf('fill') !== -1
    );
  }
  removedowntimeTrackingDetails(index: number) {
    this.downtimeTrackingDetails.removeAt(index);
}
get downtimeTrackingDetails(): FormArray {
  return this.downtimeTrackingForm.get('downtimeTrackingDetails') as FormArray;
}
createForm() {
  this.downtimeTrackingForm = this.formBuilder.group({
    DowntimeDate: ['', [Validators.required]],
    ProductionOrderId: ['', [Validators.required]],
    FillingLineId: ['', Validators.required],
    ProductId: ['', [Validators.required]],
    downtimeTrackingDetails: this.formBuilder.array([])
  });
}

addDowntimeDetail() {
  const downtimeDetailGroup = this.formBuilder.group({
    StartTime: ['', [Validators.required]],
    EndTime: ['', [Validators.required]],
    Cause: [''],
    Notes: [''],
    DoneByUserIds: [[]], // Ensure this is defined
    ShiftId: [''] // Ensure this is defined
  });

  this.downtimeTrackingDetails.push(downtimeDetailGroup);
}


  populateFormArray(details: any[]) {
    const formArray = this.downtimeTrackingDetails;
    formArray.clear();

    details.forEach(detail => {
      const group = this.formBuilder.group({
        StartTime: [detail.StartTime || ''],
        EndTime: [detail.EndTime || ''],
        Cause: [detail.Cause || ''],
        Notes: [detail.Notes || '']
      });

      formArray.push(group);
    });
  }

  addFinalDowntimeDetail() {
    const downtimeDetail = this.downtimeTrackingDetails.at(0).value;

    if (!downtimeDetail.StartTime || !downtimeDetail.EndTime) {
      this.notificationService.error("Start Time and End Time are required");
    } else {
      if (this.EditDetailsId >= 0) {
        this.AddedDowntimeTrackingDetailsList[this.EditDetailsId] = downtimeDetail;
        this.addDowntimeDetail();
      } else {
        this.AddedDowntimeTrackingDetailsList.push(downtimeDetail);
        this.addDowntimeDetail();
      }
    }
  }

  onEditDetail(detail: any, index: number) {
    this.populateFormArray([detail]);
    this.EditDetailsId = index;
  }

  removeDowntimeDetail(index: number) {
    this.AddedDowntimeTrackingDetailsList.splice(index, 1);
  }

  private createDowntimeTracking(payload) {
    this.downtimeTrackingService.addDowntimeTracking(payload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Downtime Tracking created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateDowntimeTracking(payload) {
    this.downtimeTrackingService.updateDowntimeTracking(payload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Downtime Tracking updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    this.isFormSubmitted = true;

    if (this.downtimeTrackingForm.invalid) {
        return;
    }
    else if (this.AddedDowntimeTrackingDetailsList.length < 1) {
        this.notificationService.error("At least one downtime detail is required");
        return;
    }
    else {
        let formValue = this.downtimeTrackingForm.value;
        formValue.downtimeTrackingDetails = this.AddedDowntimeTrackingDetailsList;

        console.log("Form value before transformation:", formValue);

        let payload = this.transformData(formValue);
        console.log("Payload for API:", payload);

        if (this.isEditMode) {
            this.updateDowntimeTracking(payload);
        } else {
            this.createDowntimeTracking(payload);
        }
    }
}

transformData(originalData: any): any {
  const detailsArray = Array.isArray(originalData.downtimeTrackingDetails)
    ? originalData.downtimeTrackingDetails
    : [];

  return {
    id: this.isEditMode ? this.downtimeTrackingData.id : 0,
    code: 'string', // Set as per your requirement or fetch from form if needed
    productionDateTime: originalData.DowntimeDate,
    productId: originalData.ProductId,
    productName: 'string', // Set as per your requirement or fetch from form if needed
    productLineId: originalData.FillingLineId,
    productLineName: 'string', // Set as per your requirement or fetch from form if needed
    isActive: true, // Assuming default active status
    sapProductionOrderId: originalData.ProductionOrderId,
    downtimeTrackingDetails: detailsArray.map(detail => {
      const startDate = new Date(detail.StartTime);
      const endDate = new Date(detail.EndTime);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Invalid date values:", detail.StartTime, detail.EndTime);
        return null; // or handle the invalid dates as needed
      }

      return {
        id: 0, // or fetch from form if necessary
        headerId: this.isEditMode ? this.downtimeTrackingData.id : 0,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        durations: this.calculateDuration(startDate, endDate),
        cause: detail.Cause,
        actionTaken: detail.ActionTaken || '',
        actionTakenId: detail.ActionTakenId || 0,
        isActive: true // Assuming default active status
      };
    }).filter(detail => detail !== null) // Remove any invalid details
  };
}

calculateDuration(startDate: Date, endDate: Date): string {
  if (!startDate || !endDate) return '0';
  
  const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // Duration in minutes
  
  return duration.toString();
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
