import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permission/permission.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { PermissionListComponent } from './list/list.component';
import { PermissioonAddEditComponent } from './add-edit/add-edit.component';
import { PreCheckListComponent } from '../pre-check/list/list.component';
// import { PermissionSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
      path: '',
      component: PermissionComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: PermissionListComponent,
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.permissioon, title: 'Permission' }
          },
          {
              path: 'add',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.permissioon, title: 'Permission' },
              component: PermissioonAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.permissioon, title: 'Permission' },
              component: PermissioonAddEditComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }

export const PermissionComponents = [
 PermissionComponent,
 PermissioonAddEditComponent,PermissionListComponent
];
