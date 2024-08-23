import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { StudentRoutingModule, StudentComponents } from './student-routing.module';
import { StudentService } from './student.service';

@NgModule({
    declarations: [
        ...StudentComponents
    ],
    imports: [
        SharedModule,
        StudentRoutingModule
    ],
    providers: [
        StudentService
    ]
})
export class StudentModule { }
