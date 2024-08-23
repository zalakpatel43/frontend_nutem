import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order.component';
import { SalesOrderAddEditComponent } from './add-edit/add-edit.component';
import { SalesOrderListComponent } from './list/list.component';
import { SalesOrderSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

const routes: Routes = [
    {
        path: '',
        component: SalesOrderComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: SalesOrderListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.salesOrder, action: PermissionType.list, title: 'Sales Order' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.salesOrder, action: PermissionType.create, title: 'Sales Order' },
                component: SalesOrderAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.salesOrder, action: PermissionType.edit, title: 'Sales Order' },
                component: SalesOrderAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesOrderRoutingModule { }

export const SalesOrderComponents = [
    SalesOrderComponent, SalesOrderListComponent, SalesOrderAddEditComponent,
    SalesOrderSearchPanelComponent
];
