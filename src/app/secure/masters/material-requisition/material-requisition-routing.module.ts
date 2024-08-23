import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialRequisitionComponent } from './material-requisition.component';
import { MaterialRequisitionAddEditComponent } from './add-edit/add-edit.component';
import { MaterialRequisitionListComponent } from './list/list.component';
import { MaterialRequisitionSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

const routes: Routes = [
    {
        path: '',
        component: MaterialRequisitionComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: MaterialRequisitionListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.materialRequisition, action: PermissionType.list, title: 'Material Requisition' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.materialRequisition, action: PermissionType.create, title: 'Material Requisition' },
                component: MaterialRequisitionAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.materialRequisition, action: PermissionType.edit, title: 'Material Requisition' },
                component: MaterialRequisitionAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialRequisitionRoutingModule { }

export const MaterialRequisitionComponents = [
    MaterialRequisitionComponent, MaterialRequisitionListComponent, MaterialRequisitionAddEditComponent,
    MaterialRequisitionSearchPanelComponent
];
