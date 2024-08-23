import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { JobCard } from '@app-models'; // Ensure JobCard model is defined
import { JobCardService } from '../job-card.service';

@Component({
    templateUrl: './add-edit.component.html'
})
export class JobCardAddEditComponent implements OnInit, OnDestroy {
    jobCardData: JobCard;
    jobCardId: number;
    isEditMode: boolean;
    frmJobCard: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.jobcard;
    permissions = PermissionType;
    error: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private jobCardService: JobCardService,
        private notificationService: ToastrService
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getJobCardRoute();
    }

    private getJobCardRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params['id']);
            this.createForm();
            if (this.isEditMode) {
                this.jobCardId = +params['id'];
                this.getJobCardDetails();
            }
        });
    }

    private getJobCardDetails() {
        this.jobCardService.getById(this.jobCardId)
            .subscribe((result: JobCard) => {
                this.jobCardData = result;
                this.setJobCardData();
            },
            (error) => {
                console.log(error);
            });
    }

    private setJobCardData() {
        this.frmJobCard.patchValue(this.jobCardData);
    }

    createForm() {
        this.frmJobCard = this.formBuilder.group({
            jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
            assignedTo: ['', [Validators.required, Validators.maxLength(100)]],
            dueDate: ['', [Validators.required]],
            status: ['', [Validators.required, Validators.maxLength(50)]],
            priority: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
        });
    }

    private createJobCard() {
        let jobCard: JobCard = this.frmJobCard.value;
        this.jobCardService.add(jobCard)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success('Job Card saved successfully.');
            },
            (error) => {
                this.error = error;
            });
    }

    private updateJobCard() {
        let jobCard: JobCard = this.frmJobCard.value;
        this.jobCardData = Object.assign(this.jobCardData, jobCard);

        this.jobCardService.update(this.jobCardData.id, this.jobCardData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success('Job Card updated successfully.');
            },
            (error) => {
                this.error = error;
            });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmJobCard.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateJobCard();
        } else {
            this.createJobCard();
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
        this.routerSub.unsubscribe();
    }
}
