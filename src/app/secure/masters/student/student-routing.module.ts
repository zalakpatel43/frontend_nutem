import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { StudentAddEditComponent } from './add-edit/add-edit.component';
import { StudentListComponent } from './list/list.component';
import { StudentSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

const routes: Routes = [
    {
        path: '',
        component: StudentComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: StudentListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.student, action: PermissionType.list, title: 'Student' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.student, action: PermissionType.create, title: 'Student' },
                component: StudentAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.student, action: PermissionType.edit, title: 'Student' },
                component: StudentAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentRoutingModule { }

export const StudentComponents = [
    StudentComponent, StudentListComponent, StudentAddEditComponent,
    StudentSearchPanelComponent
];
