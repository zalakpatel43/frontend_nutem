import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PreCheckService } from '../pre-check.service';
import { PermissionService } from 'src/app/core/service/permission.service';

@Component({
    selector: 'app-pre-check-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.scss']
})
export class PreCheckAddEditComponent implements OnInit, OnDestroy {
    preCheckForm: UntypedFormGroup;
    isEditMode: boolean;
    preCheckId: number;
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
    isLoadingQuestions: boolean = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private preCheckService: PreCheckService,
        private notificationService: ToastrService,
        private permissionService: PermissionService,
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadQuestions();
        this.getRoute();
        this.loadDropdowns();
        this.IsViewPermission = this.permissionService.hasPermission('PreCheck List (PER_PRECHEKLIST) - View');

    }

    // Getter for preCheckListDetails FormArray
    get preCheckDetails(): FormArray {
        return this.preCheckForm.get('preCheckListDetails') as FormArray;
    }

    private getRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !!params['id'];

            this.createForm();
            if (this.isEditMode) {
                this.preCheckId = +params['id'];
                this.getPreCheckById();
            }
        });
    }

    private createForm() {
        this.preCheckForm = this.formBuilder.group({
            StartDate: ['', [Validators.required]],
            ProductionOrderId: ['', [Validators.required]],
            ShiftId: ['', [Validators.required]],
            FillingLineId: ['', [Validators.required]],
            ProductId: ['', [Validators.required]],
            FillerOperatorIds: ['', [Validators.required]],
            Comments: [''],
            isActive: [true],
            preCheckListDetails: this.formBuilder.array([])
        });
    }

    private loadDropdowns() {
        this.preCheckService.getAllProductionOrders().subscribe({
            next: (result: any) => {
                this.productionOrderList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Production Orders.');
                console.error(err);
            }
        });

        this.preCheckService.getAllShifts().subscribe({
            next: (result: any) => {
                this.shiftList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Shifts.');
                console.error(err);
            }
        });

        this.preCheckService.getAllFillingLines().subscribe({
            next: (result: any) => {
                // Filter the result to only include items where categoryName is "FillingLine"
                this.fillingLineList = result.filter((line: any) => line.categoryName === "FillingLine");
            },
            error: (err) => {
                this.notificationService.error('Failed to load Filling Lines.');
                console.error(err);
            }
        });
        this.preCheckService.getAllProducts().subscribe({
            next: (result: any) => {
                this.productList = result;
            },
            error: (err) => {
                this.notificationService.error('Failed to load Products.');
                console.error(err);
            }
        });

        this.preCheckService.getAllFillerOperators().subscribe({
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
        this.preCheckService.getAllQuestions().subscribe({
            next: (result: any) => {
                this.questionList = result.filter((question: any) => question.type === 1);
                console.log("Questions", this.questionList);
                if (this.questionList && this.questionList.length > 0) {
                    const controls = this.questionList.map(question => this.formBuilder.group({
                        questionId: [question.id, [Validators.required]],
                        answer: [1],
                        reason: ['']
                    }));
                    this.preCheckForm.setControl('preCheckListDetails', this.formBuilder.array(controls));

                }
            },
            error: (err) => {
                this.notificationService.error('Failed to load Questions.');
                console.error(err);
                this.isLoadingQuestions = false;
            }
        });
    }

    getToday() {
        return new Date().toISOString().split('T')[0];
    }


    private getPreCheckById() {
        this.preCheckService.getByIdPreCheck(this.preCheckId).subscribe({
            next: (result: any) => {
                //  console.log('Incoming Pre Check Data:', result);
                // Convert fillerUserIds to an array
                let fillerUserIds: number[] = [];
                if (result.fillerUserIds) {
                    // Handle single value or comma-separated string
                    fillerUserIds = result.fillerUserIds.split(',').map(id => +id);
                }

                this.preCheckForm.patchValue({
                    StartDate: result.startDateTime,
                    ProductionOrderId: result.productionOrderId,
                    ShiftId: result.shiftId,
                    FillingLineId: result.fillingLine,
                    ProductId: result.productId,
                    FillerOperatorIds: fillerUserIds,
                    Comments: result.comments,
                    isActive: result.isActive
                });
                setTimeout(() => {
                    if (result.preCheckListDetails.length > 0) {
                        // Set preCheckListDetails if available
                        this.setPreCheckListDetails(result.preCheckListDetails);
                    }
                }, 1000);


            },
            error: (err) => {
                this.notificationService.error('Failed to load Pre Check details.');
                console.error(err);
            }
        });
    }

    private setPreCheckListDetails(details: any[]) {
        if (details) {
            console.log("Preque details", details)
            const formArray = this.preCheckDetails;
            formArray.clear();

            details.forEach(detail => {
                formArray.push(this.formBuilder.group({
                    id: [detail.id],
                    questionId: [detail.questionId, [Validators.required]],
                    answer: [detail.answer, [Validators.required]],
                    reason: [detail.reason || '']
                }));
            });
        }

    }

    onAnswerChange(index: number) {
        const formArray = this.preCheckDetails;
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

        if (this.preCheckForm.invalid) {
            return;
        }

        // Extract the first non-null questionId from preCheckListDetails
        const detailsArray = this.preCheckDetails.controls as UntypedFormGroup[];
        const firstQuestionId = detailsArray.find(detail => detail.get('questionId').value)?.get('questionId').value;

        // Create payload
        const payload = {
            Id: this.isEditMode ? this.preCheckId : 0, // Assuming Id is 0 for new entries
            Code: '', // Add Code if needed
            StartDateTime: this.preCheckForm.get('StartDate').value,
            ProductionOrderId: this.preCheckForm.get('ProductionOrderId').value,
            ProductId: this.preCheckForm.get('ProductId').value,
            ShiftId: this.preCheckForm.get('ShiftId').value,
            FillingLine: this.preCheckForm.get('FillingLineId').value,
            FillerUserIds: this.preCheckForm.get('FillerOperatorIds').value.join(','), // Assuming FillerOperatorIds is an array
            Comments: this.preCheckForm.get('Comments').value,
            IsActive: this.preCheckForm.get('isActive').value,
            PrePostQuestionId: firstQuestionId,

            PreCheckListDetails: this.preCheckForm.get('preCheckListDetails').value.map(detail => ({
                id: detail.id || 0,
                questionId: detail.questionId,
                answer: detail.answer,
                reason: detail.reason
            }))
        };

        // console.log('Outgoing payload:', payload);

        if (this.isEditMode) {
            this.preCheckService.updatePreCheck(payload).subscribe({
                next: () => {
                    this.notificationService.success('Pre Check updated successfully.');
                    this.router.navigate(['/secure/masters', 'production-order']);
                    //  this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
                },
                error: (err) => {
                    this.notificationService.error('Failed to update Pre Check.');
                    this.error = err;
                    console.error(err);
                }
            });
        } else {
            this.preCheckService.addPreCheck(payload).subscribe({
                next: () => {
                    this.notificationService.success('Pre Check created successfully.');
                    this.router.navigate(['/secure/masters', 'production-order']);
                    //  this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
                },
                error: (err) => {
                    this.notificationService.error('Failed to create Pre Check.');
                    this.error = err;
                    console.error(err);
                }
            });
        }
    }

    // save() {
    //     this.isFormSubmitted = true;

    //     if (this.preCheckForm.invalid) {
    //         return;
    //     }

    //     const formValue = this.preCheckForm.value;

    //     // Map form data to match the API model
    //     const payload = {
    //         Id: this.isEditMode ? this.preCheckId : 0, // Assuming Id is 0 for new entries
    //         Code: '', // Add Code if needed
    //         StartDateTime: formValue.StartDate,
    //         ProductionOrderId: formValue.ProductionOrderId,
    //         ProductId: formValue.ProductId,
    //         ShiftId: formValue.ShiftId,
    //         FillingLine: formValue.FillingLineId,
    //         FillerUserIds: formValue.FillerOperatorIds.join(','), 
    //         Comments: formValue.Comments,
    //         IsActive: formValue.isActive,
    //         PrePostQuestionId: formValue.PrePostQuestionId, 

    //         PreCheckListDetails: formValue.preCheckListDetails.map((detail: any) => ({
    //             id: detail.id || 0, // Default to 0 if not editing
    //             questionId: detail.questionId,
    //             answer: detail.answer,
    //             reason: detail.reason
    //         }))
    //     };

    //     console.log('Outgoing payload:', payload);

    //     if (this.isEditMode) {
    //         this.preCheckService.updatePreCheck(payload).subscribe({
    //             next: () => {
    //                 this.notificationService.success('Pre Check updated successfully.');
    //                 this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
    //             },
    //             error: (err) => {
    //                 this.notificationService.error('Failed to update Pre Check.');
    //                 this.error = err;
    //                 console.error(err);
    //             }
    //         });
    //     } else {
    //         this.preCheckService.addPreCheck(payload).subscribe({
    //             next: () => {
    //                 this.notificationService.success('Pre Check created successfully.');
    //                 this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
    //             },
    //             error: (err) => {
    //                 this.notificationService.error('Failed to create Pre Check.');
    //                 this.error = err;
    //                 console.error(err);
    //             }
    //         });
    //     }
    // }


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
