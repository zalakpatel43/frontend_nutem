import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PalletPackingComponent } from './pallet-packing/pallet-packing.component';
import { PalletPackingListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { PalletPackingAddEditComponent } from './add-edit/add-edit.component';
import { PalletPackingSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PalletPackingComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: PalletPackingListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'Pallet Packing (PER_PALLETPACKING) - View' }
      },
      {
        path: 'add',
        canActivate: [PermissionGuard],
        data: { permission: 'Pallet Packing (PER_PALLETPACKING) - Add' },
        component: PalletPackingAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        data: { permission: 'Pallet Packing (PER_PALLETPACKING) - Edit' },
        component: PalletPackingAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PalletPackingRoutingModule { }

export const PalletPackingComponents = [
  PalletPackingSearchPanelComponent,
  PalletPackingComponent,
  PalletPackingListComponent,
  PalletPackingAddEditComponent
];
