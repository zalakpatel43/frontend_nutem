import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { AttributeCheckService } from '../attribute-check.service';
import { ToastrService } from 'ngx-toastr';
import { WeightCheckService } from '../../weight-check/weight-check.service';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
  selector: 'app-add-edit',
  // standalone: true,
  // imports: [],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class AttributeCheckAddEditComponent implements OnInit, OnDestroy {
  attributeCheckData: any;
  attributeCheckId: number;
  isEditMode: boolean;
  attributeCheckForm: UntypedFormGroup;
  routerSub: Subscription;
  isFormSubmitted: boolean;
  page: string = ApplicationPage.attributeCheck;
  permissions = PermissionType;
  error: string;
  // shiftList: any[] = [];
  productionOrderList: any[] = [];
  productList: any[] = [];
  usersList: any[] = [];
  // GoodConditionList: [{ Field: 'Yes', value: true },{ Field: 'No', value: false } ];
  //LeakTestList: [{ Field: 'None', value: 0 },{ Field: 'Yes', value: 1 },{ Field: 'No', value: 2 } ];
  // IsCorrect : [{ Field: 'Yes', value: true },{ Field: 'No', value: false } ];
  attributeCheckDetails: FormArray;
  AddedattributeCheckDetailsList: any[] = [];
  EditDetailsId: number = -1;

  IsViewPermission: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private attributeCheckService: AttributeCheckService,
    private notificationService: ToastrService, private weightCheckService: WeightCheckService,
    private permissionService: PermissionService) {
    // this.createForm();
  }

  ngOnInit(): void {
    this.getRoute();
    this.loadDropdowns();
    this.IsViewPermission = this.permissionService.hasPermission('Weight Check (PER_WEIGHTCHECK) - View');

  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params["id"]);
      this.createForm();
      this.addAttributeDetail();
      if (this.isEditMode) {
        this.attributeCheckId = params.id//+params["id"];
        this.getAttributeCheckById();
      }
    });
  }

  private getAttributeCheckById() {
    this.attributeCheckService.getByIdAttributeCheck(this.attributeCheckId)
      .subscribe((result: any) => {
        this.attributeCheckData = result;
        this.setAttirbuteCheckData();

        //  console.log("get by id data", result)
      },
        (error) => {
          console.log(error);
        });
  }

  private setAttirbuteCheckData() {
    this.attributeCheckForm.patchValue({
      ACCode: this.attributeCheckData.code,
      ACDate: this.attributeCheckData.acDate,
      ProductionOrderId: this.attributeCheckData.productionOrderId,
      ProductId: this.attributeCheckData.productId,
      BottleDateCode: this.attributeCheckData.bottleDateCode,
      PackSize: this.attributeCheckData.packSize,
      IsWeightRange: this.attributeCheckData.isWeightRange,
      Note: this.attributeCheckData.note
    });
    this.attributeCheckForm.get('ProductionOrderId').disable();
    this.attributeCheckForm.get('ProductId').disable();

    const formatTimeWithAMPM = (dateTime: string): string => {
      const date = new Date(dateTime);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    setTimeout(() => {
      this.attributeCheckData.attributeCheckDetails?.forEach(element => {

        const doneByArray: number[] = element.doneByUserIds.split(',').map(item => Number(item.trim())).filter(value => !isNaN(value));
        let DoneByNames = this.usersList.filter(item => element.doneByUserIds?.includes(item.id)).map(item => item.name)

        // console.log("done by array", doneByArray);
        let DetailsData = {
          TDateTime: formatTimeWithAMPM(element.tDateTime),
          IsGoodCondition: element.isGoodCondition,
          CapTorque: element.capTorque,
          Id: element.id,
          EmptyBottleWeight: element.emptyBottleWeight,
          LotNoOfLiquid: element.lotNoOfLiquid,
          IsCorrect: element.isCorrect,
          LeakTest: element.leakTest,
          DoneByUserIds: doneByArray,
          Usernames: DoneByNames
        }

        this.AddedattributeCheckDetailsList.push(DetailsData);
      });
      // console.log("added nozzle data", this.AddedattributeCheckDetailsList)
      //         let item :any;
    }, 500);

  }

  private loadDropdowns() {

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
    this.attributeCheckForm = this.formBuilder.group({
      ACCode: [{ value: '', disabled: true }, , [Validators.required]],
      ACDate: ['', [Validators.required]],
      ProductionOrderId: ['', [Validators.required]],
      ProductId: ['', [Validators.required]],
      BottleDateCode: ['', [Validators.required]],
      PackSize: ['', [Validators.required]],
      IsWeightRange: [false], // assuming default false is fine
      Note: [''],
      attributeCheckDetails: this.formBuilder.array([])
    });
    this.attributeCheckForm.controls["ACDate"].setValue(new Date().toISOString().split('T')[0]);
  }



  getToday() {
    return new Date().toISOString().split('T')[0];
  }


  addAttributeDetail() {
    this.attributeCheckDetails?.clear();
    this.EditDetailsId = -1;

    const attributeCheckItem = this.formBuilder.group({});

    // Add controls dynamically without validators
    attributeCheckItem.addControl('TDateTime', this.formBuilder.control(''));
    attributeCheckItem.addControl('IsGoodCondition', this.formBuilder.control(true));
    attributeCheckItem.addControl('CapTorque', this.formBuilder.control(''));
    attributeCheckItem.addControl('EmptyBottleWeight', this.formBuilder.control(''));
    attributeCheckItem.addControl('LotNoOfLiquid', this.formBuilder.control(''));
    attributeCheckItem.addControl('IsCorrect', this.formBuilder.control(true));
    attributeCheckItem.addControl('LeakTest', this.formBuilder.control(0));
    attributeCheckItem.addControl('DoneByUserIds', this.formBuilder.control(''));

    // Get the FormArray from the parent form
    this.attributeCheckDetails = this.attributeCheckForm?.get('attributeCheckDetails') as FormArray;

    // Push the newly created FormGroup into the FormArray
    this.attributeCheckDetails.push(attributeCheckItem);

    // Log to verify
    // console.log("attributeCheckDetails", this.attributeCheckDetails);


  }


  addFinalAttributeDetail() {

    const AttribteDetail = this.attributeCheckDetails.at(0).value;

    if (!AttribteDetail.TDateTime) {
      this.notificationService.error("please select time");
    }
    else if (!AttribteDetail.DoneByUserIds) {
      this.notificationService.error("please select Done by");
    }
    else {
      if (this.EditDetailsId >= 0) {
        AttribteDetail["Usernames"] = this.usersList.filter(user => AttribteDetail.DoneByUserIds.includes(user.id)).map(user => user.name);
        this.AddedattributeCheckDetailsList[this.EditDetailsId] = AttribteDetail;
        this.addAttributeDetail();
      }
      else {
        AttribteDetail["Usernames"] = this.usersList.filter(user => AttribteDetail.DoneByUserIds.includes(user.id)).map(user => user.name);
        this.AddedattributeCheckDetailsList.push(AttribteDetail);
        this.addAttributeDetail();

        // Log the updated list with averages
        // console.log("Added nozzle with average:", this.AddedattributeCheckDetailsList);
      }

    }

  }
  onEditDetail(Attribute, i) {
    // console.log("weight", Attribute);
    // console.log("i", i)
    //  console.log("details selected for edit", this.AddedattributeCheckDetailsList[i]);

    this.populateFormWithValues(this.AddedattributeCheckDetailsList[i]);
    this.EditDetailsId = i;
  }


  removeAttributeCheckDetail(i: number) {
    // const control = <FormArray>this.WeightCheckForm?.controls['ItemList'];
    // control.removeAt(i);

    this.AddedattributeCheckDetailsList.splice(i, 1);
    // console.log("control", this.AddedWeightCheckDetailsList)
    //  console.log("items", this.AddedWeightCheckDetailsList);
  }

  populateFormWithValues(data: any | any[]) {
    // Ensure data is in array format
    const dataArray = Array.isArray(data) ? data : [data];

    // Retrieve the FormArray
    this.attributeCheckDetails = this.attributeCheckForm.get('attributeCheckDetails') as FormArray;

    // Clear existing FormArray
    this.attributeCheckDetails.clear();

    // Populate each FormGroup in the FormArray
    dataArray.forEach(dataItem => {
      const item = this.formBuilder.group({});
      const doneByArray: number[] = dataItem.DoneByUserIds.split(',').map(item => Number(item.trim())).filter(value => !isNaN(value));

      // Add static controls with data
      item.addControl('TDateTime', this.formBuilder.control(dataItem.TDateTime || ''));
      item.addControl('IsGoodCondition', this.formBuilder.control(dataItem.IsGoodCondition || ''));
      item.addControl('CapTorque', this.formBuilder.control(dataItem.CapTorque || ''));
      item.addControl('EmptyBottleWeight', this.formBuilder.control(dataItem.EmptyBottleWeight || ''));
      item.addControl('LotNoOfLiquid', this.formBuilder.control(dataItem.LotNoOfLiquid || ''));
      item.addControl('IsCorrect', this.formBuilder.control(dataItem.IsCorrect || ''));
      item.addControl('LeakTest', this.formBuilder.control(dataItem.LeakTest || ''));
      item.addControl('DoneByUserIds', this.formBuilder.control(doneByArray || ''));

      // Push the populated FormGroup into the FormArray
      this.attributeCheckDetails.push(item);
    });

    // console.log("Populated WeightCheckDetails:", this.attributeCheckDetails);
  }


  removeAttributeDetail(i: number) {
    // const control = <FormArray>this.WeightCheckForm?.controls['ItemList'];
    // control.removeAt(i);

    this.AddedattributeCheckDetailsList.splice(i, 1);
    // console.log("control", this.AddedattributeCheckDetailsList)
  }

  private createAttributeCheck(Playload) {

    this.attributeCheckService.addAttributeCheck(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Attribute Check created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateAttributeCheck(Playload) {
    this.attributeCheckService.updateAttributeCheck(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Attribute Check updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    this.isFormSubmitted = true;
    // const endDate = this.attributeCheckForm.get('EndDateTime')?.value;
    // const startDate = this.WeightCheckForm.get('StartDateTime')?.value;

    if (this.attributeCheckForm.invalid) {
      return;
    }
    // else if(new Date(endDate) <= new Date(startDate)){
    //   this.notificationService.error("End date should be greated than Start date")
    //   return;
    // }
    else if (this.AddedattributeCheckDetailsList.length < 1) {
      this.notificationService.error("at lease one Attribute check deatils required");
      return;
    }
    else {
      let formvalue = this.attributeCheckForm.value;
      formvalue.attributeCheckDetails = this.AddedattributeCheckDetailsList;
      // console.log("formvalue", formvalue)
      let Playload = this.transformData(formvalue);
      // console.log("Playload", Playload)

      if (this.isEditMode) {
        this.updateAttributeCheck(Playload);
      } else {
        this.createAttributeCheck(Playload);
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

    const detailsArray = Array.isArray(originalData.attributeCheckDetails)
      ? originalData.attributeCheckDetails
      : Object.values(originalData.attributeCheckDetails || {});

    const result = {
      id: this.isEditMode ? this.attributeCheckData.id : 0,
      code: this.isEditMode ? this.attributeCheckData.code : "",
      aCDate: formatToDateTime(originalData.ACDate),
      productionOrderId: this.isEditMode ? this.attributeCheckData.productionOrderId : originalData.ProductionOrderId,
      productId: this.isEditMode ? this.attributeCheckData.productId : originalData.ProductId,
      bottleDateCode: originalData.BottleDateCode.toString(),
      packSize: originalData.PackSize.toString(),
      isWeightRange: originalData.IsWeightRange,
      note: originalData.Note, // Capitalize first letter

      attributeCheckDetails: Array.isArray(detailsArray) ? detailsArray.map((details, index) => ({

        id: 0,
        headerId: 0, // Static value, update if needed
        tDateTime: formatToTime(details.TDateTime), // Assuming Time is the timestamp
        isGoodCondition: details.IsGoodCondition,
        capTorque: details.CapTorque,
        emptyBottleWeight: (details.EmptyBottleWeight ? details.EmptyBottleWeight : 0).toString(),
        lotNoOfLiquid: details.LotNoOfLiquid,
        isCorrect: details.IsCorrect,
        leakTest: details.LeakTest,
        DoneByUserIdList: details.DoneByUserIds,
        // DoneByUserNames : details.Usernames

      })) : []
    };

    return result;
  }

  cancel() {
    this.router.navigate(['/secure/masters', 'production-order']);
    // if (this.isEditMode) {
    //   this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
    // } else {
    //   this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
    // }
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}