import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { LiquidPreparationService } from '../liquid-preparation.service';
import { WeightCheckService } from '../../weight-check/weight-check.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
  // standalone: true,
  // imports: [],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class LiquidPreparationAddEditComponent implements OnInit, OnDestroy {
  selectedIndex = 0; // Start with the first tab
  tabCount = 6;      // Total number of tabs
  isstartChecklistDisable: boolean = true;
  isInstructionsDisable: boolean = true;
  isEndChecklistDisable: boolean = true;
  isQualityDisable: boolean = true;
  isAdjustmentDisable: boolean = true;
  isEditMode: boolean;
  routerSub: Subscription;
  page: string = ApplicationPage.liquidPreparation;
  permissions = PermissionType;

  liquidPreparationData: any;
  liquidPreparationId: number;

  isBasicFormSubmitted: boolean;
  basicForm: UntypedFormGroup;
  isEndDateOk: boolean = false;
  draftBasicFormValue: any;

  isStartCheckListFormSubmitted: boolean;
  StartCheckListForm: UntypedFormGroup;
  draftStartCheckListFormValue: any;
  StartCheckListQueList: any[] = [];

  isInstructionFormSubmitted: boolean;
  InstructionForm: UntypedFormGroup;
  draftInstructionFormValue: any;
  AddedInstructionList: any[] = [];
  DiffWghInstructionList: any[] = [];
  EditInstructionId: number = -1;
  totalWeight: number = 0;
  totalWeightAdded: number = 0;

  isEndCheckListFormSubmitted: boolean;
  EndCheckListForm: UntypedFormGroup;
  draftEndCheckListFormValue: any;
  EndCheckListQueList: any[] = [];

  isQualityFormSubmitted: boolean;
  QualityForm: UntypedFormGroup;
  draftQualityFormValue: any;
  AddedQualityList: any[] = [];
  EditQualityId: number = -1;

  error: string;
  shiftList: any[] = [];
  productionOrderList: any[] = [];
  productList: any[] = [];
  usersList: any[] = [];
  startEndBatchChecklist: any[] = [];
  materialMasterList: any[] = [];
  productInstructionDetailsList: any[] = [];
  qCTSpecificationMasterList: any[] = [];
  tankList: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private liquidPreparationService: LiquidPreparationService,
    private notificationService: ToastrService, private weightCheckService: WeightCheckService,
    private cdr: ChangeDetectorRef) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDropdowns();
    this.getRoute();
  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params["id"]);
      this.createForm();
      //this.addAttributeDetail();
      if (this.isEditMode) {
        this.liquidPreparationId = params.id//+params["id"];
        // this.getAttributeCheckById();
      }
    });
  }

  goToPreviousTab() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  goToNextTab() {
    if (this.selectedIndex === 0) {
      this.isBasicFormSubmitted = true;
      console.log("basic form value", this.basicForm.value);
      if (this.basicForm.valid && this.isEndDateOk) {
        this.draftBasicFormValue = this.basicForm.value;
        this.isstartChecklistDisable = false;
        if (this.selectedIndex < this.tabCount - 1) {
          this.selectedIndex++;
        }
      }
    }
    else if (this.selectedIndex === 1) {
      this.isStartCheckListFormSubmitted = true;
      console.log("start check form value", this.StartCheckListForm.value);
      let IsValid = this.StartCheckListValidation();
      if (this.StartCheckListForm.valid && IsValid) {
        this.draftStartCheckListFormValue = this.StartCheckListForm.value;
        this.isInstructionsDisable = false;
        if (this.selectedIndex < this.tabCount - 1) {
          this.selectedIndex++;
        }
      }
    }
    else if (this.selectedIndex === 2) {
      //this.isStartCheckListFormSubmitted = true;
      // console.log("start check form value", this.StartCheckListForm.value);
      // let IsValid = this.StartCheckListValidation();
      if (this.AddedInstructionList.length <= 0) {
        this.notificationService.error("select at least one instruction");
        return;
      }
      else {
         // this.draftStartCheckListFormValue = this.StartCheckListForm.value;
          this.isEndChecklistDisable = false;
          if (this.selectedIndex < this.tabCount - 1) {
            this.selectedIndex++;
          }
      }

    }
    else if (this.selectedIndex === 3) {
      this.isEndCheckListFormSubmitted = true;
      console.log("end check form value", this.EndCheckListForm.value);
      let IsValid = this.EndCheckListValidation();
      if (this.EndCheckListForm.valid && IsValid) {
        this.draftEndCheckListFormValue = this.EndCheckListForm.value;
        this.isQualityDisable = false;
        if (this.selectedIndex < this.tabCount - 1) {
          this.selectedIndex++;
        }
      }
    }
    if (this.selectedIndex < this.tabCount - 1) {
      this.selectedIndex++;
    }
  }

  onEndDateChange() {
    const endDate = this.basicForm.get('EndDateTime')?.value;
    const startDate = this.basicForm.get('StartDateTime')?.value;
    if (!startDate) {
      this.notificationService.error("please select Start date");
      this.isEndDateOk = false;
    }
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      this.notificationService.error("End date should be greated than Start date");
      this.isEndDateOk = false;
    } else {
      this.basicForm.get('EndDateTime')?.updateValueAndValidity();
      this.isEndDateOk = true;
    }
  }

  private getAttributeCheckById() {
    // this.attributeCheckService.getByIdAttributeCheck(this.attributeCheckId)
    //   .subscribe((result: any) => {
    //     this.attributeCheckData = result;
    //     this.setAttirbuteCheckData();

    //     console.log("get by id data", result)
    //   },
    //     (error) => {
    //       console.log(error);
    //     });
  }

  private setAttirbuteCheckData() {
    //     this.attributeCheckForm.patchValue({
    //       ACCode: this.attributeCheckData.code,
    //       ACDate: this.attributeCheckData.acDate,
    //       ProductionOrderId: this.attributeCheckData.productionOrderId,
    //       ProductId: this.attributeCheckData.productId,
    //       BottleDateCode: this.attributeCheckData.bottleDateCode,
    //       PackSize: this.attributeCheckData.packSize,
    //       IsWeightRange: this.attributeCheckData.isWeightRange,
    //       Note: this.attributeCheckData.note
    //     });
    //     this.attributeCheckForm.get('ProductionOrderId').disable();
    //     this.attributeCheckForm.get('ProductId').disable();

    //     const formatTimeWithAMPM = (dateTime: string): string => {
    //       const date = new Date(dateTime);
    //       return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    //     };

    //     setTimeout(() => {
    //       this.attributeCheckData.attributeCheckDetails?.forEach(element => {

    //         const doneByArray: number[] = element.doneByUserIds.split(',').map(item => Number(item.trim())).filter(value => !isNaN(value));
    // console.log("done by array", doneByArray);
    //         let DetailsData = {
    //           TDateTime: formatTimeWithAMPM(element.tDateTime),
    //           IsGoodCondition: element.isGoodCondition,
    //           CapTorque: element.capTorque,
    //           Id: element.id,
    //           EmptyBottleWeight: element.emptyBottleWeight,
    //           LotNoOfLiquid: element.lotNoOfLiquid,
    //           IsCorrect: element.isCorrect,
    //           LeakTest: element.leakTest,
    //           DoneByUserIds: element.doneByUserIds,
    //         }

    //         this.AddedattributeCheckDetailsList.push(DetailsData);
    //       });
    //       console.log("added nozzle data", this.AddedattributeCheckDetailsList)
    //       //         let item :any;
    //     }, 500);

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

    this.weightCheckService.getShiftList()
      .subscribe((result: any) => {
        this.shiftList = result;
      });

    this.liquidPreparationService.getTankMasterList()
      .subscribe((result: any) => {
        this.tankList = result;
      });


    this.liquidPreparationService.getStartEndBatchCheckList()
      .subscribe((result: any) => {
        this.startEndBatchChecklist = result;
        this.StartCheckListQueList = result.filter(item => item.type === "1");
        this.EndCheckListQueList = result.filter(item => item.type === "2");
        this.CreateStartChecklIstForm();
        this.CreateEndChecklIstForm();
      });


    this.liquidPreparationService.getMaterialMasterList()
      .subscribe((result: any) => {
        this.materialMasterList = result;
      });


    this.liquidPreparationService.getQCTSpecificationMasterList()
      .subscribe((result: any) => {
        this.qCTSpecificationMasterList = result;
      });


    this.liquidPreparationService.getProductInstructionDetailsList()
      .subscribe((result: any) => {
        this.productInstructionDetailsList = result;
      });

  }

  createForm() {
    this.basicForm = this.formBuilder.group({
      Id: [{ value: '', disabled: true }], // Assuming Id is not editable
      Code: ['', ''], // Required
      StartDateTime: ['', [Validators.required]], // Required
      EndDateTime: ['', [Validators.required]], // Required
      SAPProductionOrderId: ['', [Validators.required]], // Required and numeric
      ProductId: ['', [Validators.required]], // Required and numeric
      ShiftId: ['', [Validators.required]], // Required and numeric
      BatchLotNumber: ['', [Validators.required]], // Required
      TankId: ['', [Validators.required]], // Required and numeric
      CompounderUserId: ['', [Validators.required]],
      StandardBatchWeight: ['', [Validators.required]]
    });
    this.basicForm.controls["StartDateTime"].setValue(new Date().toISOString().split('T')[0]);

    // Start checklist ANd End Checklist form create after StartEndList dropdown API call

    this.CreateInstructionForm();
    this.CreateQualityForm();

  }

  CreateStartChecklIstForm() {
    this.StartCheckListForm = this.formBuilder.group({
      questions: this.formBuilder.array(this.createQuestionControls())
    });
  }

  CreateInstructionForm() {
    this.EditInstructionId = -1;

    this.InstructionForm = this.formBuilder.group({
      InstructionId: ['', [Validators.required]],
      MaterialId: ['', [Validators.required]], // Required
      LotNumber: ['', [Validators.required]], // Required
      Weight: ['', [Validators.required]], // Required and numeric
      WeightAdded: ['', [Validators.required]], // Required and numeric
      DoneByIds: ['', [Validators.required]], // Required and numeric
      AddedTime: ['', [Validators.required]],
    });
    const currentDateTime = new Date(); // Get current date and time
  }

  CreateEndChecklIstForm() {
    this.EndCheckListForm = this.formBuilder.group({
      questions: this.formBuilder.array(this.createEndQuestionControls())
    });
  }

  CreateQualityForm() {
    this.EditQualityId = -1;

    this.QualityForm = this.formBuilder.group({
      InstructionId: ['', [Validators.required]],
      MaterialId: ['', [Validators.required]], // Required
      LotNumber: ['', [Validators.required]], // Required
      Weight: ['', [Validators.required]], // Required and numeric
      WeightAdded: ['', [Validators.required]], // Required and numeric
      DoneByIds: ['', [Validators.required]], // Required and numeric
      AddedTime: ['', [Validators.required]],
    });
    const currentDateTime = new Date(); // Get current date and time
  }

  createQuestionControls(): FormGroup[] {
    return this.StartCheckListQueList.map(question => this.formBuilder.group({
      id: [question.id],
      question: [question.question],
      answer: ['Yes', Validators.required],
      tankNo: [''],
      tankId: [''],
      reason: ['']
    }));
  }

  get questionsArray(): FormArray {
    return this.StartCheckListForm.get('questions') as FormArray;
  }

  onAnswerChange(event, i) {
    console.log("ebent & i", event, i);
    if (event.value === "No") {
      this.notificationService.error("You can't select NO");

      const questionsArray = this.StartCheckListForm.get('questions') as FormArray;
      if (i >= 0) {
        const questionGroup = questionsArray?.at(i) as FormGroup;
        console.log("questiongroup", questionGroup)
        if (questionGroup) {
          questionGroup.controls['answer']?.setValue('Yes', { emitEvent: true });
          this.cdr.detectChanges();
        }
      }
      else {
        console.error('Index out of bounds');
      }
    }
  }

  StartCheckListValidation(): boolean {
    const questionsArray = this.StartCheckListForm.get('questions') as FormArray;

    if (!questionsArray) {
      this.notificationService.error("Form is not initialized correctly.");
      return false;
    }

    let isValid = true;

    questionsArray.controls.forEach((control: AbstractControl, index: number) => {
      const questionGroup = control as FormGroup; // Explicitly cast to FormGroup

      const answer = questionGroup.get('answer')?.value;
      const reason = questionGroup.get('reason')?.value;

      if (answer === 'NA' && (!reason || reason.trim().length === 0)) {
        this.notificationService.error("Reason is mandatory when answer is 'NA'.");
        isValid = false;
      }
    });

    return isValid;

  }

  createEndQuestionControls(): FormGroup[] {
    return this.EndCheckListQueList.map(question => this.formBuilder.group({
      id: [question.id],
      question: [question.question],
      answer: ['Yes', Validators.required],
      tankNo: [''],
      tankId: [''],
      reason: ['']
    }));
  }

  get EndquestionsArray(): FormArray {
    return this.EndCheckListForm.get('questions') as FormArray;
  }

  onEndAnswerChange(event, i) {
    console.log("ebent & i", event, i);
    if (event.value === "No") {
      this.notificationService.error("You can't select NO");

      const questionsArray = this.EndCheckListForm.get('questions') as FormArray;
      if (i >= 0) {
        const questionGroup = questionsArray?.at(i) as FormGroup;
        console.log("questiongroup", questionGroup)
        if (questionGroup) {
          questionGroup.controls['answer']?.setValue('Yes', { emitEvent: true });
          this.cdr.detectChanges();
        }
      }
      else {
        console.error('Index out of bounds');
      }
    }
  }

  EndCheckListValidation(): boolean {
    const questionsArray = this.EndCheckListForm.get('questions') as FormArray;

    if (!questionsArray) {
      this.notificationService.error("Form is not initialized correctly.");
      return false;
    }

    let isValid = true;

    questionsArray.controls.forEach((control: AbstractControl, index: number) => {
      const questionGroup = control as FormGroup; // Explicitly cast to FormGroup

      const answer = questionGroup.get('answer')?.value;
      const reason = questionGroup.get('reason')?.value;
      const id =  questionGroup.get('id')?.value;
      const tankId =  questionGroup.get('tankId')?.value;

      if (answer === 'NA' && (!reason || reason.trim().length === 0)) {
        this.notificationService.error("Reason is mandatory when answer is 'NA'.");
        isValid = false;
      }
      if (answer === 'Yes' && id == 27 &&  !tankId ) {
        this.notificationService.error("Tank is mandatory when Storage tank available 'Yes' .");
        isValid = false;
      }

    });

    return isValid;

  }


  onInstructionChange(event) {
    console.log("inst change", event);

    let weight = this.productInstructionDetailsList.find(x => x.id == event.value).weight;
    this.InstructionForm.controls['Weight'].setValue(weight);
    this.InstructionForm.get('AddedTime')?.setValue(new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
  }

  addInstruction() {
    this.isInstructionFormSubmitted = true;

    if (this.InstructionForm.valid) {
      let formvalue = this.InstructionForm.value;
      if (formvalue.Weight != formvalue.WeightAdded) {
        formvalue["diffWeight"] = formvalue.Weight - formvalue.WeightAdded;
      }
      else {
        formvalue["diffWeight"] = 0;
      }

      let DoneByNames = this.usersList
        .filter(item => formvalue.DoneByIds.includes(item.id))
        .map(item => item.name)
        .join(', ');
      formvalue["DoneByNames"] = DoneByNames;
      formvalue["InstructionName"] = this.productInstructionDetailsList.find(x => x.id == formvalue.InstructionId).instruction;
      formvalue["MaterialName"] = this.materialMasterList.find(x => x.id == formvalue.MaterialId).materialName;

      if (this.EditInstructionId >= 0) {
        this.AddedInstructionList[this.EditInstructionId] = formvalue;
        this.calculateTotals();
        this.InstructionForm.reset();
        this.isInstructionFormSubmitted = false;
        this.CreateInstructionForm();
      }
      else {
        this.AddedInstructionList.push(formvalue);
        this.calculateTotals();
        this.InstructionForm.reset();
        this.isInstructionFormSubmitted = false;
        this.CreateInstructionForm();

      }
    }
    console.log("AddedInstructionList", this.AddedInstructionList)
  }

  calculateTotals() {
    this.totalWeight = this.AddedInstructionList
      .reduce((sum, ins) => sum + (ins.Weight || 0), 0);

    this.totalWeightAdded = this.AddedInstructionList
      .reduce((sum, ins) => sum + (ins.WeightAdded || 0), 0);
  }

  onEditDetail(instruction, i) {
    console.log("details selected for edit", this.AddedInstructionList[i]);

    let value = this.AddedInstructionList[i]

    this.InstructionForm.patchValue({
      InstructionId: value.InstructionId,
      MaterialId: value.MaterialId,
      LotNumber: value.LotNumber,
      Weight: value.Weight,
      WeightAdded: value.WeightAdded,
      DoneByIds: value.DoneByIds,
      AddedTime: new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    });

    this.EditInstructionId = i;
  }

  removeDetail(i: number) {
    this.AddedInstructionList.splice(i, 1);
    console.log("AddedInstructionList", this.AddedInstructionList);
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }


  private createliquidPreparation(Playload) {

    this.liquidPreparationService.addLiquidPreparation(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Liquid Preparation created successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  private updateliquidPreparation(Playload) {
    this.liquidPreparationService.updateLiquidPreparation(Playload)
      .subscribe(() => {
        this.cancel();
        this.notificationService.success("Liquid Preparation updated successfully.");
      },
        (error) => {
          this.error = error;
        });
  }

  save() {
    //this.isFormSubmitted = true;
    // const endDate = this.attributeCheckForm.get('EndDateTime')?.value;
    // const startDate = this.WeightCheckForm.get('StartDateTime')?.value;

    // if (this.attributeCheckForm.invalid) {
    //   return;
    // }
    // else if(new Date(endDate) <= new Date(startDate)){
    //   this.notificationService.error("End date should be greated than Start date")
    //   return;
    // }
    // else if (this.AddedattributeCheckDetailsList.length < 1) {
    //   this.notificationService.error("at lease one Attribute check deatils required");
    //   return;
    // }
    // else {
    //   let formvalue = this.attributeCheckForm.value;
    //   formvalue.attributeCheckDetails = this.AddedattributeCheckDetailsList;
    //   console.log("formvalue", formvalue)
    //   let Playload = this.transformData(formvalue);
    //   console.log("Playload", Playload)

    //   if (this.isEditMode) {
    //     this.updateliquidPreparation(Playload);
    //   } else {
    //     this.createliquidPreparation(Playload);
    //   }
    // }
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
      // id: this.isEditMode ? this.attributeCheckData.id : 0,
      // code: this.isEditMode ? this.attributeCheckData.code : "",
      // aCDate: formatToDateTime(originalData.ACDate),
      // productionOrderId: this.isEditMode ? this.attributeCheckData.productionOrderId : originalData.ProductionOrderId,
      // productId: this.isEditMode ? this.attributeCheckData.productId : originalData.ProductId,
      // bottleDateCode: originalData.BottleDateCode.toString(),
      // packSize: originalData.PackSize.toString(),
      // isWeightRange: originalData.IsWeightRange,
      // note: originalData.Note, // Capitalize first letter

      // attributeCheckDetails: Array.isArray(detailsArray) ? detailsArray.map((details, index) => ({

      //   id: 0,
      //   headerId: 0, // Static value, update if needed
      //   tDateTime: formatToTime(details.TDateTime), // Assuming Time is the timestamp
      //   isGoodCondition: details.IsGoodCondition,
      //   capTorque: details.CapTorque,
      //   emptyBottleWeight: (details.EmptyBottleWeight ? details.EmptyBottleWeight : 0).toString(),
      //   lotNoOfLiquid: details.LotNoOfLiquid,
      //   isCorrect: details.IsCorrect,
      //   leakTest: details.LeakTest,
      //   DoneByUserIdList: details.DoneByUserIds,
      //   // DoneByUserNames : details.Usernames

      // })) : []
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
