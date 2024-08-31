import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators,UntypedFormBuilder } from '@angular/forms';
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
getCauseName(arg0: any) {
throw new Error('Method not implemented.');
}
  downtimeTrackingData: any;
  downtimeTrackingId: number;
  isEditMode: boolean;
  downtimeTrackingForm: FormGroup;
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


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: FormBuilder, private downtimeTrackingService: DowntimeTrackingService,
    private notificationService: ToastrService) {}

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
      Code: this.downtimeTrackingData.code,
      ProductionDateTime: this.downtimeTrackingData.productionDateTime,
      ProductId: this.downtimeTrackingData.productId,
      ProductLineId: this.downtimeTrackingData.productLineId,
      IsActive: this.downtimeTrackingData.isActive,
      SAPProductionOrderId: this.downtimeTrackingData.sapProductionOrderId
    });

    const formatDate = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toISOString().split('T')[0]; // Only date part
    };

    setTimeout(() => {
      this.downtimeTrackingData.downtimeTrackingDetails?.forEach(element => {
        let DetailsData = {
          StartDate: formatDate(element.startDate),
          EndDate: formatDate(element.endDate),
          Durations: element.durations,
          CauseId: element.cause,
          ActionTaken: element.actionTaken,
          ActionTakenId: element.actionTakenId,
          IsActive: element.isActive
        };

        this.addedDowntimeTrackingDetailsList.push(DetailsData);
      });
    }, 500);
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
  }

  createForm() {
    this.downtimeTrackingForm = this.formBuilder.group({
      Code: [{ value: '', disabled: true }, Validators.required],
      ProductionDateTime: ['', Validators.required],
      ProductId: ['', Validators.required],
      ProductLineId: ['', Validators.required],
      IsActive: [false],
      SAPProductionOrderId: [''],
      downtimeTrackingDetails: this.formBuilder.array([])
    });
    this.downtimeTrackingForm.controls["ProductionDateTime"].setValue(new Date().toISOString().split('T')[0]);
  }

  addDowntimeDetail() {
    this.downtimeTrackingDetails?.clear();
    this.editDetailsId = -1;

    const downtimeTrackingItem = this.formBuilder.group({});

    downtimeTrackingItem.addControl('StartDate', this.formBuilder.control(''));
    downtimeTrackingItem.addControl('EndDate', this.formBuilder.control(''));
    downtimeTrackingItem.addControl('Durations', this.formBuilder.control(''));
    downtimeTrackingItem.addControl('CauseId', this.formBuilder.control(''));
    downtimeTrackingItem.addControl('ActionTaken', this.formBuilder.control(''));
    downtimeTrackingItem.addControl('ActionTakenId', this.formBuilder.control(''));
    downtimeTrackingItem.addControl('IsActive', this.formBuilder.control(true));
    
    this.downtimeTrackingDetails = this.downtimeTrackingForm?.get('downtimeTrackingDetails') as FormArray;
    
    this.downtimeTrackingDetails.push(downtimeTrackingItem);
  }

  addFinalDowntimeDetail() {
    const detail = this.downtimeTrackingDetails.at(0).value;

    if (!detail.StartDate) {
      this.notificationService.error("Please select start date");
    } else if (!detail.EndDate) {
      this.notificationService.error("Please select end date");
    } else {
      if (this.editDetailsId >= 0) {
        this.addedDowntimeTrackingDetailsList[this.editDetailsId] = detail;
        this.addDowntimeDetail();
      } else {
        this.addedDowntimeTrackingDetailsList.push(detail);
        this.addDowntimeDetail();
      }
    }
  }

  onEditDetail(detail, i) {
    this.populateFormWithValues(this.addedDowntimeTrackingDetailsList[i]);
    this.editDetailsId = i;
  }

  populateFormWithValues(data: any) {
    const dataArray = Array.isArray(data) ? data : [data];

    this.downtimeTrackingDetails = this.downtimeTrackingForm.get('downtimeTrackingDetails') as FormArray;
    this.downtimeTrackingDetails.clear();

    dataArray.forEach(dataItem => {
      const item = this.formBuilder.group({});
      
      item.addControl('StartDate', this.formBuilder.control(dataItem.StartDate || ''));
      item.addControl('EndDate', this.formBuilder.control(dataItem.EndDate || ''));
      item.addControl('Durations', this.formBuilder.control(dataItem.Durations || ''));
      item.addControl('CauseId', this.formBuilder.control(dataItem.CauseId || ''));
      item.addControl('ActionTaken', this.formBuilder.control(dataItem.ActionTaken || ''));
      item.addControl('ActionTakenId', this.formBuilder.control(dataItem.ActionTakenId || ''));
      item.addControl('IsActive', this.formBuilder.control(dataItem.IsActive || true));
      
      this.downtimeTrackingDetails.push(item);
    });
  }

  removeDowntimeDetail(i: number) {
    this.addedDowntimeTrackingDetailsList.splice(i, 1);
  }

  save() {
    this.isFormSubmitted = true;

    if (this.downtimeTrackingForm.invalid) {
      return;
    } else if (this.addedDowntimeTrackingDetailsList.length < 0) {
      this.notificationService.error("At least one downtime detail is required");
      return;
    } else {
      let formValue = this.downtimeTrackingForm.value;
      formValue.downtimeTrackingDetails = this.addedDowntimeTrackingDetailsList;

      let payload = this.transformData(formValue);

      if (this.isEditMode) {
        this.updateDowntimeTracking(payload);
      } else {
        this.createDowntimeTracking(payload);
      }
    }
  }

  transformData(originalData) {
    function formatToDateTime(dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date string provided");
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const detailsArray = Array.isArray(originalData.downtimeTrackingDetails)
      ? originalData.downtimeTrackingDetails
      : Object.values(originalData.downtimeTrackingDetails || {});

    const result = {
      id: this.isEditMode ? this.downtimeTrackingData.id : 0,
      code: this.isEditMode ? this.downtimeTrackingData.code : "",
      productionDateTime: formatToDateTime(originalData.ProductionDateTime),
      productId: this.isEditMode ? this.downtimeTrackingData.productId : originalData.ProductId,
      productLineId: this.isEditMode ? this.downtimeTrackingData.productLineId : originalData.ProductLineId,
      isActive: originalData.IsActive,
      sapProductionOrderId: originalData.SAPProductionOrderId,
      downtimeTrackingDetails: detailsArray.map(detail => ({
        id: detail.id || 0,
        headerId: detail.headerId || 0,
        startDate: formatToDateTime(detail.StartDate),
        endDate: formatToDateTime(detail.EndDate),
        durations: detail.Durations,
        cause: detail.CauseId,
        actionTaken: detail.ActionTaken,
        actionTakenId: detail.ActionTakenId,
        isActive: detail.IsActive
      }))
    };

    return result;
  }

  createDowntimeTracking(payload) {
    this.downtimeTrackingService.addDowntimeTracking(payload)
      .subscribe((result) => {
        this.notificationService.success("Downtime tracking added successfully");
        this.router.navigate(['/', ApplicationPage.downtimeTracking]);
      },
        (error) => {
          console.log(error);
        });
  }

  updateDowntimeTracking(payload) {
    this.downtimeTrackingService.updateDowntimeTracking(payload)
      .subscribe((result) => {
        this.notificationService.success("Downtime tracking updated successfully");
        this.router.navigate(['/', ApplicationPage.downtimeTracking]);
      },
        (error) => {
          console.log(error);
        });
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
