import { Injectable } from '@angular/core';
import { CRUDService, BaseService } from '@app-core';
import { Student } from '@app-models'; // Make sure Student model is defined

@Injectable()
export class StudentService extends CRUDService<Student> {
    constructor(private _baseService: BaseService) {
        super(_baseService, 'student');
    }
}
