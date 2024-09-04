import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerInspectionComponent } from './trailer-inspection/trailer-inspection.component';
import { TrailerInspectionListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { TrailerInspectionAddEditComponent } from './add-edit/add-edit.component';
import { TrailerInspectionSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
      path: '',
      component: TrailerInspectionComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: TrailerInspectionListComponent,
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.trailerInspection, title: 'TrailerInspection' }
          },
          {
              path: 'add',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.trailerInspection,  title: 'TrailerInspection' },
              component: TrailerInspectionAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.trailerInspection,  title: 'TrailerInspection' },
              component: TrailerInspectionAddEditComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrailerInspectionRoutingModule { }
export const TrailerInspectionComponents = [
  TrailerInspectionSearchPanelComponent, TrailerInspectionComponent, TrailerInspectionListComponent,
   TrailerInspectionAddEditComponent
  
];