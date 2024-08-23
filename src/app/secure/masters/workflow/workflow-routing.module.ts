import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { WorkflowAddEditComponent } from './add-edit/add-edit.component';
import { WorkflowListComponent } from './list/list.component';
import { WorkflowSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// routes
const routes: Routes = [
    {
        path: '',
        component: WorkflowComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: WorkflowListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.workflow, action: PermissionType.list, title: 'Workflow' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.workflow, action: PermissionType.create, title: 'Workflow' },
                component: WorkflowAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.workflow, action: PermissionType.edit, title: 'Workflow' },
                component: WorkflowAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule { }

export const WorkflowComponents = [
    WorkflowComponent, WorkflowListComponent, WorkflowAddEditComponent,
    WorkflowSearchPanelComponent
];