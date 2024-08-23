import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Student } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../student.service';

@Component({
    templateUrl: './list.component.html'
})
export class StudentListComponent implements OnInit {

    studentData: Student[] = [];
    page: string = ApplicationPage.student;
    permissions = PermissionType;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private studentService: StudentService, private notificationService: ToastrService) {}

    ngOnInit(): void {
        this.getStudentData();
    }

    private getStudentData() {
        this.loading = true;
        this.studentService.get()
            .subscribe((result: Student[]) => {
                this.studentData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
    }

    isActiveRow(row) {
        // This function might be unnecessary for the Student model if no isActive field is present
        return {};
    }
}
