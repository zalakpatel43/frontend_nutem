import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PalletPackingComponent } from './pallet-packing/pallet-packing.component';
import { PalletPackingListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { PalletPackingAddEditComponent } from './add-edit/add-edit.component';
import { PalletPackingSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
      path: '',
      component: PalletPackingComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: PalletPackingListComponent,
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.palletPacking, title: 'Pallet Packing List' }
          },
          {
              path: 'add',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.palletPacking, title: 'Add Pallet Packing' },
              component: PalletPackingAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.palletPacking, title: 'Edit Pallet Packing' },
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
