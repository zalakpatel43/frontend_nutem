import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { CompanyAddEditComponent } from './add-edit/add-edit.component';
import { CompanyListComponent } from './list/list.component';
import { CompanySearchPanelComponent } from './search-panel/search-panel.component';
import { CompanyComponent } from './company.component';

// routes
const routes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                canActivate: [PageAuthGuard],
                component: CompanyListComponent,
                data: { page: ApplicationPage.company, action: PermissionType.list, title: 'Company' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.company, action: PermissionType.create, title: 'Company' },
                component: CompanyAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.company, action: PermissionType.edit, title: 'Company' },
                component: CompanyAddEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }

export const CompanyComponents = [
    CompanyComponent, CompanyListComponent, CompanyAddEditComponent, CompanySearchPanelComponent
];
