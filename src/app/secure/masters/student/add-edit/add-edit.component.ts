import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationPage, CommonUtility, PermissionType } from '@app-core';
import { Student } from '@app-models';
import { StudentService } from '../student.service';

@Component({
    templateUrl: './add-edit.component.html'
})
export class StudentAddEditComponent implements OnInit, OnDestroy {
    studentData: Student;
    studentId: number;
    isEditMode: boolean;
    frmStudent: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    page: string = ApplicationPage.student;
    permissions = PermissionType;
    error: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private studentService: StudentService,
        private notificationService: ToastrService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getStudentRoute();
    }

    private getStudentRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.studentId = +params["id"];
                this.getStudentDetails();
            }
        });
    }

    private getStudentDetails() {
        this.studentService.getById(this.studentId)
            .subscribe((result: Student) => {
                this.studentData = result;
                this.setStudentData();
            },
                (error) => {
                    console.log(error);
                });
    }

    private setStudentData() {
        this.frmStudent.patchValue(this.studentData);
    }

    createForm() {
        this.frmStudent = this.formBuilder.group({
            studentName: ['', [Validators.required, Validators.maxLength(100)]],
            studentNumber: ['', [Validators.required, Validators.maxLength(50)]]
        });
    }

    private createStudent() {
        let student: Student = this.frmStudent.value;
        this.studentService.add(student)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Student saved successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateStudent() {
        let student: Student = this.frmStudent.value;
        this.studentData = Object.assign(this.studentData, this.studentData, student);

        this.studentService.update(this.studentData.id, this.studentData)
            .subscribe((result) => {
                this.cancel();
                this.notificationService.success("Student updated successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;
        if (this.frmStudent.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateStudent();
        } else {
            this.createStudent();
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
