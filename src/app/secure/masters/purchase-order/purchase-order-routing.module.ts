import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderAddEditComponent } from './add-edit/add-edit.component';
import { PurchaseOrderListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { PurchaseOrderSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
    {
        path: '',
        component: PurchaseOrderComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: PurchaseOrderListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.purchaseOrder, action: PermissionType.list, title: 'Purchase Order' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.purchaseOrder, action: PermissionType.create, title: 'Purchase Order' },
                component: PurchaseOrderAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.purchaseOrder, action: PermissionType.edit, title: 'Purchase Order' },
                component: PurchaseOrderAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }

export const PurchaseOrderComponents = [
    PurchaseOrderComponent, PurchaseOrderListComponent, PurchaseOrderAddEditComponent,
    PurchaseOrderSearchPanelComponent
];
