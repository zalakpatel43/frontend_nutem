import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerLoadingComponent } from './trailor-loading/trailor-loading.component';
import { TrailerLoadingListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { TrailerLoadingAddEditComponent } from './add-edit/add-edit.component';
import { TrailerLoadingSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';
const routes: Routes = [
  {
    path: '',
    component: TrailerLoadingComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: TrailerLoadingListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'Trailer Loading (PER_TRAILERLOADING) - View' }
      },
      {
        path: 'add',
        canActivate: [PermissionGuard],
        data: { permission: 'Trailer Loading (PER_TRAILERLOADING) - Add' },
        component: TrailerLoadingAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        data: { permission: 'Trailer Loading (PER_TRAILERLOADING) - Edit' },
        component: TrailerLoadingAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrailerLoadingRoutingModule { }

export const TrailerLoadingComponents = [
  TrailerLoadingSearchPanelComponent, TrailerLoadingComponent, TrailerLoadingListComponent,
  TrailerLoadingAddEditComponent
];
