import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualityParameterComponent } from './quality-parameter.component';
import { QualityParameterAddEditComponent } from './add-edit/add-edit.component';
import { QualityParameterListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { QualityParameterSearchPanelComponent } from './search-panel/search-panel.component';

// Routes
const routes: Routes = [
    {
        path: '',
        component: QualityParameterComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: QualityParameterListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.qualityParameter, action: PermissionType.list, title: 'Quality Parameter' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.qualityParameter, action: PermissionType.create, title: 'Quality Parameter' },
                component: QualityParameterAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.qualityParameter, action: PermissionType.edit, title: 'Quality Parameter' },
                component: QualityParameterAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QualityParameterRoutingModule { }

export const QualityParameterComponents = [
    QualityParameterComponent, QualityParameterListComponent, QualityParameterAddEditComponent,
    QualityParameterSearchPanelComponent
];
