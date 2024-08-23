import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryTypeComponent } from './inventory-type.component';
import { InventoryTypeAddEditComponent } from './add-edit/add-edit.component';
import { InventoryTypeListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { InventoryTypeSearchPanelComponent } from './search-panel/search-panel.component';

// Routes
const routes: Routes = [
    {
        path: '',
        component: InventoryTypeComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: InventoryTypeListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inventoryType, action: PermissionType.list, title: 'Inventory Type' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inventoryType, action: PermissionType.create, title: 'Inventory Type' },
                component: InventoryTypeAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inventoryType, action: PermissionType.edit, title: 'Inventory Type' },
                component: InventoryTypeAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryTypeRoutingModule { }

export const InventoryTypeComponents = [
    InventoryTypeComponent, InventoryTypeListComponent, InventoryTypeAddEditComponent,
    InventoryTypeSearchPanelComponent
];
