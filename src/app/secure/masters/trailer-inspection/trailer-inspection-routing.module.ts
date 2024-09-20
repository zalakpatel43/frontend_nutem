import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerInspectionComponent } from './trailer-inspection/trailer-inspection.component';
import { TrailerInspectionListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { TrailerInspectionAddEditComponent } from './add-edit/add-edit.component';
import { TrailerInspectionSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TrailerInspectionComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: TrailerInspectionListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'Trailer Inspection (PER_TRAILERINSPECTION) - View' },
      },
      {
        path: 'add',
        canActivate: [PermissionGuard],
        data: { permission: 'Trailer Inspection (PER_TRAILERINSPECTION) - Add' },
        component: TrailerInspectionAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        data: { permission: 'Trailer Inspection (PER_TRAILERINSPECTION) - Edit' },
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