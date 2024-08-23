import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorMasterComponent } from './vendor-master.component';
import { VendorMasterAddEditComponent } from './add-edit/add-edit.component';
import { VendorMasterListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { VendorMasterSearchPanelComponent } from './search-panel/search-panel.component';

// Routes
const routes: Routes = [
    {
        path: '',
        component: VendorMasterComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: VendorMasterListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.vendorMaster, action: PermissionType.list, title: 'Vendor Master' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.vendorMaster, action: PermissionType.create, title: 'Vendor Master' },
                component: VendorMasterAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.vendorMaster, action: PermissionType.edit, title: 'Vendor Master' },
                component: VendorMasterAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendorMasterRoutingModule { }

export const VendorMasterComponents = [
    VendorMasterComponent, VendorMasterListComponent, VendorMasterAddEditComponent,
    VendorMasterSearchPanelComponent
];