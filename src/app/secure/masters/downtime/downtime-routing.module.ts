import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DowntimeTrackingComponent } from './downtime/downtime.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { DowntimeTrackingListComponent } from './list/list.component';
import { DowntimeTrackingAddEditComponent } from './add-edit/add-edit.component';
import { DowntimeTrackingSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DowntimeTrackingComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: DowntimeTrackingListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'DownTime Tracking (PER_DOWNTIMECHECKING) - View' },
      },
      {
        path: 'add',
        canActivate: [PermissionGuard],
        data: { permission: 'DownTime Tracking (PER_DOWNTIMECHECKING) - Add' },
        component: DowntimeTrackingAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        data: { permission: 'DownTime Tracking (PER_DOWNTIMECHECKING) - Edit' },
        component: DowntimeTrackingAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DowntimeTrackingRoutingModule { }

export const DowntimeTrackingComponents = [
  DowntimeTrackingSearchPanelComponent,
  DowntimeTrackingComponent,
  DowntimeTrackingListComponent,
  DowntimeTrackingAddEditComponent
];
