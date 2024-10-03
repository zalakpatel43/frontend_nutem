import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { TrailerLoadingService } from '../trailor-loading.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PermissionService } from 'src/app/core/service/permission.service';


@Component({
  selector: 'app-add-edit-trailer-loading',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class TrailerLoadingAddEditComponent implements OnInit, OnDestroy {
  trailerLoadingData: any;
  trailerLoadingId: number;
  isEditMode: boolean;
  TrailerLoadingForm: UntypedFormGroup;
  routerSub: Subscription;
  isFormSubmitted: boolean;
  page: string = ApplicationPage.trailerLoading;
  permissions = PermissionType;
  error: string;
  usersList: any[] = [];
  productionOrderList: any[] = [];
  productList: any[] = [];
  TrailerLoadingDetails: FormArray;
  AddedTrailerLoadingDetailsList: any[] = [];
  EditDetailId: number = -1;
  minEndDate: Date | null = null;

  IsViewPermission: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private trailerLoadingService: TrailerLoadingService,
    private notificationService: ToastrService,
    private permissionService: PermissionService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
    this.addTrailerLoadingDetail();
    this.IsViewPermission = this.permissionService.hasPermission('Trailer Loading (PER_TRAILERLOADING) - View');

  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params['id']);
      if (this.isEditMode) {
        this.trailerLoadingId = +params['id'];
        this.getTrailerLoadingById();
      }
    });
  }

  private getTrailerLoadingById() {
    this.trailerLoadingService.getByIdTrailerLoading(this.trailerLoadingId)
      .subscribe((result: any) => {
        this.trailerLoadingData = result;
        this.setTrailerLoadingData();
      },
        (error) => {
          console.log(error);
        });
  }

  private setTrailerLoadingData() {
    this.TrailerLoadingForm.patchValue({
      Code: this.trailerLoadingData.code,
      TLDateTime: this.trailerLoadingData.tlDateTime,
      DoorNo: this.trailerLoadingData.doorNo,
      TrailerNo: this.trailerLoadingData.trailerNo,
      BOLNo: this.trailerLoadingData.bolNo,
      SupervisedBy: this.trailerLoadingData.supervisedBy,
      SupervisedOn: this.trailerLoadingData.supervisedOn,
    });

    // this.TrailerLoadingForm.get('BOLNo').disable();

    // Format time with AM/PM
    const formatTimeWithAMPM = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    setTimeout(() => {
      this.trailerLoadingData.trailerLoadingDetails?.forEach(element => {
        const detailData = {
          ProductId: element.productId,
          PalletQty: element.palletQty,
          ProductionOrder: element.productionOrder,
          ActionTakenBy: element.actionTakenBy,
          Time: formatTimeWithAMPM(element.time), // Assuming `time` is a property in your data
          Id: element.id,
          HeaderId: element.headerId,
        };

        this.AddedTrailerLoadingDetailsList.push(detailData);
      });
      //  console.log("added trailer loading details", this.AddedTrailerLoadingDetailsList);
    }, 500);
  }
  productMap: Map<number, string> = new Map();
  productionOrderMap: Map<number, string> = new Map();
  userMap: Map<number, string> = new Map();

  private loadDropdowns() {
    this.trailerLoadingService.getUserList()
      .subscribe((result: any) => {
        this.usersList = result;
        this.userMap = new Map(result.map(user => [user.id, user.name]));
      });
    this.trailerLoadingService.getProductionOrderList()
      .subscribe((result: any) => {
        this.productionOrderList = result;
        this.productionOrderMap = new Map(result.map(order => [order.id.toString(), order.poNumber])); // Ensure keys are strings if necessary
        // console.log('Production Order Map after loading:', Array.from(this.productionOrderMap.entries()));
      });

    this.trailerLoadingService.getProductList()
      .subscribe((result: any) => {
        this.productList = result;
        this.productMap = new Map(result.map(product => [product.id, product.productName]));
      });
  }


  createForm() {
    this.TrailerLoadingForm = this.formBuilder.group({
      Code: [],
      TLDateTime: [new Date().toISOString(),],  // Ensure it's ISO format
      DoorNo: ['', [Validators.required]],
      TrailerNo: ['', [Validators.required]],
      BOLNo: ['', [Validators.required]],
      SupervisedBy: ['', [Validators.required]],
      SupervisedOn: [new Date().toISOString(), [Validators.required]],  // Ensure it's ISO format
      TrailerLoadingDetails: this.formBuilder.array([])
    });
  }

  addTrailerLoadingDetail() {
    // Clear existing details
    this.TrailerLoadingDetails = this.TrailerLoadingForm.get('TrailerLoadingDetails') as FormArray;
    this.TrailerLoadingDetails.clear();
    this.EditDetailId = -1;

    // Create a new form group
    const item = this.formBuilder.group({});
    //  console.log("ProductList", this.productList); // Assuming this is your API response for products

    // Dynamically add ProductId control based on the API response
    this.productList.forEach((product) => {
      item.addControl(product.id, this.formBuilder.control(""));
    });

    // Add the remaining static controls
    item.addControl('ProductId', this.formBuilder.control(""));
    item.addControl('PalletQty', this.formBuilder.control(""));
    item.addControl('ProductionOrder', this.formBuilder.control(""));
    item.addControl('ActionTakenBy', this.formBuilder.control(""));

    // Push the dynamically created item form group into the TrailerLoadingDetails form array
    this.TrailerLoadingDetails.push(item);
    // console.log("TrailerLoadingDetails", this.TrailerLoadingDetails);
  }

  addFinalTrailerLoadingDetail() {
    const trailerDetail = this.TrailerLoadingDetails.at(0).value;
    trailerDetail.ProductionOrder = String(trailerDetail.ProductionOrder);
    //console.log("Trailer loading", trailerDetail)

    // Perform validation checks
    if (!trailerDetail.ActionTakenBy) {
      this.notificationService.error('Please select Action Taken By');
    }
    else if (trailerDetail.PalletQty < 0) {
      this.notificationService.error('Qty can not be leass than 0');
    } else {
      // If editing an existing entry, update it in the list
      if (this.EditDetailId >= 0) {
        this.AddedTrailerLoadingDetailsList[this.EditDetailId] = trailerDetail;
        this.EditDetailId = -1; // Reset edit ID after updating
      } else {
        // If adding a new entry, push it to the list
        this.AddedTrailerLoadingDetailsList.push(trailerDetail);
      }

      // Add an empty form group for additional entries
      this.addTrailerLoadingDetail();
    }

    // console.log("Added Trailer Loading Details List:", this.AddedTrailerLoadingDetailsList);
  }


  onEditDetail(trailerDetail, i) {
    this.populateFormWithValues([trailerDetail]);
    //  console.log("Editing detail:", trailerDetail);
    this.EditDetailId = i;
  }


  populateFormWithValues(data: any | any[]) {
    // Ensure data is in array format
    const dataArray = Array.isArray(data) ? data : [data];

    // Retrieve the FormArray
    this.TrailerLoadingDetails = this.TrailerLoadingForm.get('TrailerLoadingDetails') as FormArray;

    // Clear existing FormArray
    this.TrailerLoadingDetails.clear();


    // Populate each FormGroup in the FormArray
    dataArray.forEach(dataItem => {
      // Create a new FormGroup for each item
      const item = this.formBuilder.group({});

      // Add static controls with data
      item.addControl('ProductId', this.formBuilder.control(dataItem.ProductId || ''));
      item.addControl('PalletQty', this.formBuilder.control(dataItem.PalletQty || ''));
      // Convert ProductionOrder to integer
      const productionOrderValue = parseInt(dataItem.ProductionOrder, 10);
      item.addControl('ProductionOrder', this.formBuilder.control(isNaN(productionOrderValue) ? '' : productionOrderValue));
      item.addControl('ActionTakenBy', this.formBuilder.control(dataItem.ActionTakenBy || ''));

      // Push the populated FormGroup into the FormArray
      this.TrailerLoadingDetails.push(item);
    });

    // console.log("Populated TrailerLoadingDetails:", this.TrailerLoadingDetails);
  }


  removeTrailerLoadingDetail(i: number) {
    this.AddedTrailerLoadingDetailsList.splice(i, 1);
    this.TrailerLoadingDetails.removeAt(i);
  }

  private createTrailerLoading(Playload) {
    this.trailerLoadingService.addTrailerLoading(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Trailer Loading created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateTrailerLoading(Playload) {
    this.trailerLoadingService.updateTrailerLoading(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Trailer Loading updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    this.isFormSubmitted = true;

    const endDateControl = this.TrailerLoadingForm.get('SupervisedOn');
    const startDateControl = this.TrailerLoadingForm.get('TLDateTime');

    const endDate = endDateControl?.value;
    const startDate = startDateControl?.value;

    // console.log('End Date:', endDate, 'Type:', typeof endDate);
    // console.log('Start Date:', startDate, 'Type:', typeof startDate);

    if (this.TrailerLoadingForm.invalid) {
      return;
    } else {
      const endDateObj = new Date(endDate);
      const startDateObj = new Date(startDate);

      // console.log('Parsed End Date:', endDateObj);
      // console.log('Parsed Start Date:', startDateObj);

      if (endDateObj <= startDateObj) {
        this.notificationService.error("Supervised On date should be greater than TL Date Time");
        return;
      } else if (this.AddedTrailerLoadingDetailsList.length === 0) {
        this.notificationService.error("At least one Trailer Loading detail is required");
        return;
      } else {
        let formvalue = this.TrailerLoadingForm.value;
        formvalue.TrailerLoadingDetails = this.AddedTrailerLoadingDetailsList;
        let Playload = this.transformData(formvalue);

        // console.log('Form Value:', formvalue);
        // console.log('Transformed Payload:', Playload);

        if (this.isEditMode) {
          this.updateTrailerLoading(Playload);
        } else {
          this.createTrailerLoading(Playload);
        }
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

    const detailsArray = Array.isArray(originalData.TrailerLoadingDetails)
      ? originalData.TrailerLoadingDetails
      : Object.values(originalData.TrailerLoadingDetails || {});

    return {
      Id: this.isEditMode ? this.trailerLoadingData.id : 0,
      Code: this.isEditMode ? this.trailerLoadingData.code : "",
      TLDateTime: formatToDateTime(originalData.TLDateTime),
      DoorNo: String(originalData.DoorNo),  // Ensure DoorNo is a string
      TrailerNo: String(originalData.TrailerNo),  // Ensure TrailerNo is a string
      BOLNo: String(originalData.BOLNo),  // Ensure BOLNo is a string
      SupervisedBy: originalData.SupervisedBy,
      SupervisedOn: formatToDateTime(originalData.SupervisedOn),
      TrailerLoadingDetails: Array.isArray(detailsArray) ? detailsArray.map(details => ({
        ProductId: details.ProductId,
        PalletQty: details.PalletQty,
        ProductionOrder: details.ProductionOrder,
        ActionTakenBy: details.ActionTakenBy,
      })) : []
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
    this.routerSub?.unsubscribe();
  }
}
