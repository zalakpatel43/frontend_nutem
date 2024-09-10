import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerLoadingComponent } from './trailor-loading/trailor-loading.component';
import { TrailerLoadingListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { TrailerLoadingAddEditComponent } from './add-edit/add-edit.component';
import { TrailerLoadingSearchPanelComponent } from './search-panel/search-panel.component';
const routes: Routes = [
  {
    path: '',
    component: TrailerLoadingComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: TrailerLoadingListComponent,
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.trailerLoading, title: 'Trailer Loading' }
      },
      {
        path: 'add',
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.trailerLoading, title: 'Trailer Loading' },
        component: TrailerLoadingAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.trailerLoading, title: 'Trailer Loading' },
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
