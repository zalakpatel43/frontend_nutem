import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { CustomerAddEditComponent } from './add-edit/add-edit.component';
import { CustomerListComponent } from './list/list.component';
import { CustomerSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// routes
const routes: Routes = [
    {
        path: '',
        component: CustomerComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: CustomerListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.customer, action: PermissionType.list, title: 'Customer' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.customer, action: PermissionType.create, title: 'Customer' },
                component: CustomerAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.customer, action: PermissionType.edit, title: 'Customer' },
                component: CustomerAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }

export const CustomerComponents = [
    CustomerComponent, CustomerListComponent, CustomerAddEditComponent,
    CustomerSearchPanelComponent
];
