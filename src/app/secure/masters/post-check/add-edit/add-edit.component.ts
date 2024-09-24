import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PostCheckService } from '../post-check.service';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
    selector: 'post-check-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.scss']
})
export class PostCheckAddEditComponent implements OnInit, OnDestroy {
    postCheckForm: UntypedFormGroup;
    isEditMode: boolean;
    postCheckId: number;
    routerSub: Subscription;
    productionOrderList: any[] = [];
    shiftList: any[] = [];
    fillingLineList: any[] = [];
    productList: any[] = [];
    fillerOperatorList: any[] = [];
    questionList: any[] = [];
    isFormSubmitted: boolean = false;
    error: string;

    IsViewPermission: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private postCheckService: PostCheckService,
        private notificationService: ToastrService,
        private permissionService: PermissionService
    ) { }

    ngOnInit(): void {
        this.getRoute();
        this.loadDropdowns();
        this.loadQuestions();
        this.IsViewPermission = this.permissionService.hasPermission('PostCheck List (PER_POSTCHEKLIST) - View');

    }

    // Getter for postCheckListDetails FormArray
    get postCheckDetails(): FormArray {
        return this.postCheckForm.get('postCheckListDetails') as FormArray;
    }

    private getRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !!params['id'];
            this.createForm();
            if (this.isEditMode) {
                this.postCheckId = +params['id'];
                this.getPostCheckById();
            }
        });
    }

    private createForm() {
        this.postCheckForm = this.formBuilder.group({
            EndDate: ['', [Validators.required]],
            ProductionOrderId: ['', [Validators.required]],
            ShiftId: ['', [Validators.required]],
            FillingLineId: ['', [Validators.required]],
            ProductId: ['', [Validators.required]],
            FillerOperatorIds: ['', [Validators.required]],
            Comments: [''],
            isActive: [true],
            postCheckListDetails: this.formBuilder.array([])
        });
    }

    private loadDropdowns() {
        this.postCheckService.getAllProductionOrders().subscribe({
            next: (result: any) => {
                this.productionOrderList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Production Orders.');
                console.error(err);
            }
        });

        this.postCheckService.getAllShifts().subscribe({
            next: (result: any) => {
                this.shiftList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Shifts.');
                console.error(err);
            }
        });

        this.postCheckService.getAllFillingLines().subscribe({
            next: (result: any) => {
                // Filter the result to only include items where categoryName is "FillingLine"
                this.fillingLineList = result.filter((line: any) => line.categoryName === "FillingLine");
            },
            error: (err) => {
                this.notificationService.error('Failed to load Filling Lines.');
                console.error(err);
            }
        });
        

        this.postCheckService.getAllProducts().subscribe({
            next: (result: any) => {
                this.productList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Products.');
                console.error(err);
            }
        });

        this.postCheckService.getAllFillerOperators().subscribe({
            next: (result: any) => {
                this.fillerOperatorList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Filler Operators.');
                console.error(err);
            }
        });
    }

    private loadQuestions() {
        this.postCheckService.getAllQuestions().subscribe({
            next: (result: any) => {
                this.questionList = result.filter((question: any) => question.type === 2);
                console.log("Questions", this.questionList);

                // Initialize form array based on the number of questions
                const controls = this.questionList.map(question => this.formBuilder.group({
                    questionId: [question.id, [Validators.required]],
                    answer: [1],
                    reason: ['']
                }));
                this.postCheckForm.setControl('postCheckListDetails', this.formBuilder.array(controls));
            },
            error: (err) => {
                this.notificationService.error('Failed to load Questions.');
                console.error(err);
            }
        });
    }


    private getPostCheckById() {
        this.postCheckService.getByIdPostCheck(this.postCheckId).subscribe({
            next: (result: any) => {
                console.log('Incoming Post Check Data:', result);
                // Convert fillerUserIds to an array
            let fillerUserIds: number[] = [];
            if (result.fillerUserIds) {
                // Handle single value or comma-separated string
                fillerUserIds = result.fillerUserIds.split(',').map(id => +id);
            }

                this.postCheckForm.patchValue({
                    EndDate: result.endDateTime,
                    ProductionOrderId: result.productionOrderId,
                    ShiftId: result.shiftId,
                    FillingLineId: result.fillingLine,
                    ProductId: result.productId,
                    FillerOperatorIds: fillerUserIds,
                    Comments: result.comments,
                    isActive: result.isActive
                });

                // Set postCheckListDetails if available
                this.setPostCheckListDetails(result.postCheckListDetails);
            },
            error: (err) => {
                this.notificationService.error('Failed to load Post Check details.');
                console.error(err);
            }
        });
    }

    private setPostCheckListDetails(details: any[]) {
        const formArray = this.postCheckDetails;
        formArray.clear();

        details.forEach(detail => {
            formArray.push(this.formBuilder.group({
                id: [detail.id],
                questionId: [detail.questionId, [Validators.required]],
                answer: [detail.answer, [Validators.required]],
                reason: [detail.reason ||'']
            }));
        });
    }

    onAnswerChange(index: number) {
        const formArray = this.postCheckDetails;
        const detail = formArray.at(index) as UntypedFormGroup;
        const answerControl = detail.get('answer');
        const reasonControl = detail.get('reason');

        // Check if the answer is 0 (No) or 1 (Yes)
        if (answerControl?.value === 0) { // No
            reasonControl?.setValidators([Validators.required]);
        } else {
            reasonControl?.clearValidators();
        }
        if (answerControl?.value === -1) {
            // Show toast message for "No" selection
            this.notificationService.error('You cannot select No. Please choose another option.');
            // Reset the answer value
            detail.get('answer').setValue(null);
        }

        reasonControl?.updateValueAndValidity();
    }


    save() {
        this.isFormSubmitted = true;
      
        if (this.postCheckForm.invalid) {
          return;
        }
      
        // Extract the first non-null questionId from postCheckListDetails
        const detailsArray = this.postCheckDetails.controls as UntypedFormGroup[];
        const firstQuestionId = detailsArray.find(detail => detail.get('questionId').value)?.get('questionId').value;
      
        // Create payload
        const payload = {
          Id: this.isEditMode ? this.postCheckId : 0, // Assuming Id is 0 for new entries
          Code: '', // Add Code if needed
          EndDateTime: this.postCheckForm.get('EndDate').value,
          ProductionOrderId: this.postCheckForm.get('ProductionOrderId').value,
          ProductId: this.postCheckForm.get('ProductId').value,
          ShiftId: this.postCheckForm.get('ShiftId').value,
          FillingLine: this.postCheckForm.get('FillingLineId').value,
          FillerUserIds: this.postCheckForm.get('FillerOperatorIds').value.join(','), // Assuming FillerOperatorIds is an array
          Comments: this.postCheckForm.get('Comments').value,
          IsActive: this.postCheckForm.get('isActive').value,
          PrePostQuestionId: firstQuestionId, 
      
          PostCheckListDetails: this.postCheckForm.get('postCheckListDetails').value.map(detail => ({
            id: detail.id || 0, 
            questionId: detail.questionId,
            answer: detail.answer,
            reason: detail.reason
          }))
        };
      
        console.log('Outgoing payload:', payload);
      
        if (this.isEditMode) {
          this.postCheckService.updatePostCheck(payload).subscribe({
            next: () => {
              this.notificationService.success('Post Check updated successfully.');
              this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
            },
            error: (err) => {
              this.notificationService.error('Failed to update Post Check.');
              this.error = err;
              console.error(err);
            }
          });
        } else {
          this.postCheckService.addPostCheck(payload).subscribe({
            next: () => {
              this.notificationService.success('Post Check created successfully.');
              this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
            },
            error: (err) => {
              this.notificationService.error('Failed to create Post Check.');
              this.error = err;
              console.error(err);
            }
          });
        }
      }
      
      cancel() {
        if (this.isEditMode) {
          this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        } else {
          this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
      }

    ngOnDestroy(): void {
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }
    }
}
