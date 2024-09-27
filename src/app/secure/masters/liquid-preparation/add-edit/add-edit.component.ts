import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { LiquidPreparationService } from '../liquid-preparation.service';
import { WeightCheckService } from '../../weight-check/weight-check.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { PermissionService } from 'src/app/core/service/permission.service';

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
  isEndDateOk: boolean = true;
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
  IsValidTestedDate : boolean = true;
  IsValidQualitydDate : boolean = true;
  StartDateOfBasicForm: any;

  IsViewPermission: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private formBuilder: UntypedFormBuilder, private liquidPreparationService: LiquidPreparationService,
    private notificationService: ToastrService, private weightCheckService: WeightCheckService,
    private cdr: ChangeDetectorRef, private permissionService: PermissionService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDropdowns();
    this.getRoute();
    this.IsViewPermission = this.permissionService.hasPermission('Liquid Preparation (PER_LIQUIDPREPARATION) - View');

  }

  private getRoute() {
    this.routerSub = this.activatedRoute.params.subscribe((params) => {
      this.isEditMode = !CommonUtility.isEmpty(params["id"]);
      this.createForm();
      //this.addAttributeDetail();
      if (this.isEditMode) {
        this.liquidPreparationId = params.id//+params["id"];
        this.getLiquidPreparationById();
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
        this.DiffWghInstructionList = [];
        this.AddedInstructionList.forEach(element => {
          if (element.diffWeight > 0 || element.diffWeight < 0) {
            this.DiffWghInstructionList.push(element);
          }
        });

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
    else if (this.selectedIndex === 4) {
      if (this.AddedQualityList.length <= 0) {
        this.notificationService.error("select at least one Quality");
        return;
      }
      else {
        this.isAdjustmentDisable = false;
        if (this.selectedIndex < this.tabCount - 1) {
          this.selectedIndex++;
        }
      }
    }
    else if (this.selectedIndex === 5) {
      console.log("added adjustment", this.DiffWghInstructionList);
    }
    // if (this.selectedIndex < this.tabCount - 1) {
    //   this.selectedIndex++;
    // }
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

  private getLiquidPreparationById() {
    this.liquidPreparationService.getByIdLiquidPreparation(this.liquidPreparationId)
      .subscribe((result: any) => {
        this.liquidPreparationData = result;
        this.setLiquidPreparationkData();

        console.log("get by id data", result)
      },
        (error) => {
          console.log(error);
        });
  }

  private setLiquidPreparationkData() {
    this.basicForm.patchValue({
      StartDateTime: this.liquidPreparationData.startDateTime,
      EndDateTime: this.liquidPreparationData.endDateTime,
      SAPProductionOrderId: this.liquidPreparationData.sapProductionOrderId,
      ProductId: this.liquidPreparationData.productId,
      ShiftId: this.liquidPreparationData.shiftId,
      BatchLotNumber: parseInt(this.liquidPreparationData.batchLotNumber),
      TankId: this.liquidPreparationData.tankId,
      CompounderUserId: this.liquidPreparationData.compounderUserId,
      StandardBatchWeight: parseInt(this.liquidPreparationData.standardBatchWeight),
    });
    this.basicForm.get('SAPProductionOrderId').disable();
    this.basicForm.get('ProductId').disable();


    setTimeout(() => {
      // Start checklist
      let EditPrechecklistData = [];
      let EditEndchecklistData = [];

      this.liquidPreparationData.liquidPreparationChecklistDetails.forEach(element => {
        if (element.type === "1") {
          EditPrechecklistData.push(element);
        }
        else {
          EditEndchecklistData.push(element);
        }
      });

      EditPrechecklistData.forEach(data => {
        const formGroup = this.StartCheckListForm.get('questions')?.value.find((group: any) => group.id === data.questionId);
        if (formGroup) {
          const index = this.StartCheckListForm.get('questions')?.value.indexOf(formGroup);
          if (index !== -1) {
            (this.StartCheckListForm.get('questions') as FormArray).at(index).patchValue({
              answer: data.answer,
              tankId: data.tankId ? data.tankId : '',
              tankNo: data.tankNo ? data.tankNo : '',
              reason: data.reason,
            });
          }
        }
      });

      EditEndchecklistData.forEach(data => {
        const formGroup = this.EndCheckListForm.get('questions')?.value.find((group: any) => group.id === data.questionId);
        if (formGroup) {
          const index = this.EndCheckListForm.get('questions')?.value.indexOf(formGroup);
          if (index !== -1) {
            (this.EndCheckListForm.get('questions') as FormArray).at(index).patchValue({
              answer: data.answer,
              tankId: data.tankId ? data.tankId : '',
              tankNo: data.tankNo ? data.tankNo : '',
              reason: data.reason,
            });
          }
        }
      });

      // Instruction 
      this.liquidPreparationData.liquidPreparationInstructionDetails.forEach(element => {
      //  let diff = element.weight - element.weightAdded;
      let diff =  (element.weightAdded  - element.weight);
      console.log("difference", diff)
        let DoneByNames = this.usersList.filter(item => element.doneByIds?.includes(item.id)).map(item => item.name)
          .join(', ');

          
        let data = {
          InstructionId: element.instructionId,
          MaterialId: element.materialId,
          LotNumber: parseInt(element.lotNumber),
          Weight: element.weight,
          WeightAdded: element.weightAdded,
          DoneByIds: element.doneByIds.split(',').map(id => parseInt(id, 10)),
          AddedTime: element.addedTime,
          diffWeight: diff,
          DoneByNames: DoneByNames,
          InstructionName: this.productInstructionDetailsList.find(x => x.id == element.instructionId)?.instruction,
          MaterialName: this.materialMasterList.find(x => x.id == element.materialId)?.materialName
        }

        this.AddedInstructionList.push(data);
      });
      this.calculateTotals();


      //Quality 

      this.liquidPreparationData.liquidPreparationSpecificationDetails.forEach(element => {
        let diff = element.weight - element.weightAdded;
        let DoneByNames = this.usersList.filter(item => element.analysisDoneByIds?.includes(item.id)).map(item => item.name)
          .join(', ');

        let data = {
          TestingDateTime: element.testingDateTime,
          AnalysisDoneByIds: element.analysisDoneByIds.split(',').map(id => parseInt(id, 10)),
          SampleReceivedTime: element.sampleReceivedTime,
          SampleTestedTime: element.sampleTestedTime,
          SpecificationLimitId: element.specificationLimitId,
          Test1: element.test1,
          Test2: element.test2,
          DoneByNames: DoneByNames,
          SpecificationLimitName: this.qCTSpecificationMasterList.find(x => x.id == element.specificationLimitId)?.specificationName,
        }

        this.AddedQualityList.push(data);
      });


      console.log("EditPrechecklistData", EditPrechecklistData)
      //console.log("formArray",formArray);

    }, 1000);




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
      TestingDateTime: ['', [Validators.required]],
      AnalysisDoneByIds: ['', [Validators.required]], // Required
      SampleReceivedTime: ['', [Validators.required]], // Required
      SampleTestedTime: ['', [Validators.required]], // Required and numeric
      SpecificationLimitId: ['', [Validators.required]], // Required and numeric
      Test1: [''], // Required and numeric
      Test2: [''],
    });
    // const TestingDateTime = new Date(); // Get current date and time
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
      const id = questionGroup.get('id')?.value;
      const tankId = questionGroup.get('tankId')?.value;

      if (answer === 'NA' && (!reason || reason.trim().length === 0)) {
        this.notificationService.error("Reason is mandatory when answer is 'NA'.");
        isValid = false;
      }
      if (answer === 'Yes' && id == 27 && !tankId) {
        this.notificationService.error("Tank is mandatory when Storage tank available 'Yes' .");
        isValid = false;
      }

    });

    return isValid;

  }


  onInstructionChange(event) {
    console.log("inst change", event);

    let weight = this.productInstructionDetailsList.find(x => x.id == event.value).weight;
    //  this.InstructionForm.get('Weight').disable();
    this.InstructionForm.controls['Weight'].setValue(weight);
    const now = new Date();
    const string = now.toISOString();
    this.InstructionForm.get('AddedTime')?.setValue(new Date());
  }

  addInstruction() {
    this.isInstructionFormSubmitted = true;

    if (this.InstructionForm.valid) {
      let formvalue = this.InstructionForm.value;
      if (formvalue.Weight != formvalue.WeightAdded) {
        formvalue["diffWeight"] = formvalue.WeightAdded  - formvalue.Weight;
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
      const now = new Date();
      formvalue.AddedTime = now.toISOString(); 
      console.log("Instruction form value", formvalue)

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

  onStartDateChange(){
    const StartDate = this.basicForm.get('StartDateTime')?.value;
    this.StartDateOfBasicForm = new Date(StartDate);
  }

  onTestingDateTimeChange(){
    const testingQualityDate = this.QualityForm.get('TestingDateTime')?.value;
    const TestDateObj = new Date(testingQualityDate);

    if (TestDateObj  && TestDateObj < this.StartDateOfBasicForm) {
      this.notificationService.error("Test date should be greated than Basic Start date");
      this.QualityForm.get('TestingDateTime')?.reset();
      this.IsValidQualitydDate = false;
    } else {
      this.QualityForm.get('TestingDateTime')?.updateValueAndValidity();
      this.IsValidQualitydDate = true;
    }
  }

  onRecieveDateChange(){
    const sampleReciveDate = this.QualityForm.get('SampleReceivedTime')?.value;
    const ReciveDateObj = new Date(sampleReciveDate);

    if (ReciveDateObj  && ReciveDateObj < this.StartDateOfBasicForm) {
      this.notificationService.error("Sample received date should be greated than Basic Start date");
      this.QualityForm.get('SampleReceivedTime')?.reset();
      this.IsValidQualitydDate = false;
    } else {
      this.QualityForm.get('SampleReceivedTime')?.updateValueAndValidity();
      this.IsValidQualitydDate = true;
    }
  }

  onTestedDateChange(){
    const TestDate = this.QualityForm.get('SampleTestedTime')?.value;
    const recieveDate = this.QualityForm.get('SampleReceivedTime')?.value;

    const TestDateObj = new Date(TestDate);
    const recieveDateObj = new Date(recieveDate);

    if (!recieveDate) {
      this.notificationService.error("please select Sample recieved date");
      this.QualityForm.get('SampleTestedTime')?.reset();
      this.IsValidTestedDate = false;
    }
   else if (recieveDate && TestDate && TestDateObj < recieveDateObj) {
      this.notificationService.error("Sample tested date should be greated than sample recieved date");
      this.QualityForm.get('SampleTestedTime')?.reset();
      this.IsValidTestedDate = false;
    } else {
      this.QualityForm.get('SampleTestedTime')?.updateValueAndValidity();
      this.IsValidTestedDate = true;
    }
  }


  addQuality() {
    this.isQualityFormSubmitted = true;
    if( !this.IsValidTestedDate){
      this.notificationService.error("Pl correct tested Date");
    }
    else if (this.QualityForm.valid) {
      let formvalue = this.QualityForm.value;
      console.log("quality formvalue", formvalue)
      let DoneByNames = this.usersList
        .filter(item => formvalue.AnalysisDoneByIds.includes(item.id))
        .map(item => item.name)
        .join(', ');
      formvalue["DoneByNames"] = DoneByNames;
      formvalue["SpecificationLimitName"] = this.qCTSpecificationMasterList.find(x => x.id == formvalue.SpecificationLimitId).specificationName;

      if (this.EditQualityId >= 0) {
        this.AddedQualityList[this.EditQualityId] = formvalue;
        this.QualityForm.reset();
        this.isQualityFormSubmitted = false;
        this.CreateQualityForm();
      }
      else {
        this.AddedQualityList.push(formvalue);
        this.QualityForm.reset();
        this.isQualityFormSubmitted = false;
        this.CreateQualityForm();
      }
    }
    else{
      this.notificationService.error("Invalid Data");
    }
    console.log("AddedQualityList", this.AddedQualityList)
  }

  onEditQualityDetail(Quality, i) {
    console.log("Quaitydetails selected for edit", this.AddedQualityList[i]);

    let value = this.AddedQualityList[i]

    this.QualityForm.patchValue({
      TestingDateTime: value.TestingDateTime,
      AnalysisDoneByIds: value.AnalysisDoneByIds, // Required
      SampleReceivedTime: value.SampleReceivedTime, // Required
      SampleTestedTime: value.SampleTestedTime, // Required and numeric
      SpecificationLimitId: value.SpecificationLimitId, // Required and numeric
      Test1: value.Test1, // Required and numeric
      Test2: value.Test2,
    });

    this.EditQualityId = i;
  }

  removeQualityDetail(i: number) {
    this.AddedQualityList.splice(i, 1);
    console.log("AddedQualityList", this.AddedQualityList);
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

  Submit() {

    console.log("draftBasicFormValue", this.draftBasicFormValue);
    console.log("draftStartCheckListFormValue", this.draftStartCheckListFormValue);
    console.log("AddedInstructionList", this.AddedInstructionList);
    console.log("draftEndCheckListFormValue", this.draftEndCheckListFormValue);
    console.log("AddedQualityList", this.AddedQualityList);
    console.log("DiffWghInstructionList", this.DiffWghInstructionList);

    let Playload = this.TransFormData();
    console.log("Playload", Playload)

    if (this.isEditMode) {
      this.updateliquidPreparation(Playload);
    } else {
      this.createliquidPreparation(Playload);
    }
  }

  formatDateForSQL(date) {
    if (!date || !date.isValid()) return null;
    return date.format("YYYY-MM-DDTHH:mm:ss");
  }

  TransFormData() {

    const mergedArray: any[] = [
      ...this.draftStartCheckListFormValue.questions.map(item => ({ ...item, type: 1 })),
      ...this.draftEndCheckListFormValue.questions.map(item => ({ ...item, type: 2 }))
    ];

    const apiPayload = {
      Id: this.isEditMode ? this.liquidPreparationId : 0,
      Code: this.isEditMode ? this.liquidPreparationData.code : '',
      StartDateTime: this.draftBasicFormValue.StartDateTime,
      EndDateTime: this.draftBasicFormValue.EndDateTime,
      SAPProductionOrderId: this.isEditMode ? this.liquidPreparationData.sapProductionOrderId : this.draftBasicFormValue.SAPProductionOrderId,
      ProductId: this.isEditMode ? this.liquidPreparationData.ProductId : this.draftBasicFormValue.ProductId,
      ShiftId: this.draftBasicFormValue.ShiftId,
      BatchLotNumber: this.draftBasicFormValue.BatchLotNumber.toString(),
      TankId: this.draftBasicFormValue.TankId,
      CompounderUserId: this.draftBasicFormValue.CompounderUserId,
      StandardBatchWeight: this.draftBasicFormValue.StandardBatchWeight.toString(),
      TestingDateTime: null,
      AnalysisDoneByIds: '',
      AnalysisDoneByList: null,
      SampleReceivedTime: null,
      SampleTestedTime: null,
      IsActive: true,
      liquidPreparationAdjustmentDetails: this.DiffWghInstructionList.map(item => ({
        Id: 0,
        LiquidPreparationId: 0,
        MaterialId: item.MaterialId,
        LiquidPreparationInstructionId: item.InstructionId,
        Weight: item.WeightAdded,
        Adjustment: item.diffWeight,
        Total: item.Weight,
        IsActive: true,
      })),
      liquidPreparationChecklistDetails: mergedArray.map(q => ({
        Id: 0,
        LiquidPreparationId: 0,
        Type: q.type.toString(), // Adjust as needed
        QuestionId: q.id,
        Answer: q.answer,
        TankNo: q.tankNo || null,
        IsActive: true,
        TankId: q.tankId || null,
        Reason: q.reason || ''
      })),
      liquidPreparationInstructionDetails: this.AddedInstructionList.map(item => ({
        Id: 0,
        LiquidPreparationId: 0,
        InstructionId: item.InstructionId,
        MaterialId: item.MaterialId,
        LotNumber: item.LotNumber.toString(),
        Weight: item.Weight,
        WeightAdded: item.WeightAdded,
        DoneByList: item.DoneByIds.map(id => `${id}`), 
        AddedTime: item.AddedTime,// Adjust as needed
        IsActive: true,
      })),
      liquidPreparationSpecificationDetails: this.AddedQualityList.map(item => ({
        Id: 0,
        LiquidPreparationId: 0,
        SpecificationLimitId: item.SpecificationLimitId,
        Test1: item.Test1 || '',
        Test2: item.Test2 || '',
        TestingDateTime: item.TestingDateTime,
        AnalysisDoneByList: item.AnalysisDoneByIds.map(id => `${id}`),
        SampleReceivedTime: item.SampleReceivedTime,
        SampleTestedTime: item.SampleTestedTime,
        IsActive: true,
      }))
    };

    return apiPayload;
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
