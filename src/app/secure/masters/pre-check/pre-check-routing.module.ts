import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreCheckComponent } from './pre-check/pre-check.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { PreCheckListComponent } from './list/list.component';
import { PreCheckAddEditComponent } from './add-edit/add-edit.component';
import { PreCheckSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
    path: '',
    component: PreCheckComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: PreCheckListComponent,
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.preCheck, title: 'PreCheck' }
      },
      {
        path: 'add',
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.preCheck, title: 'PreCheck' },
        component: PreCheckAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.preCheck, title: 'PreCheck' },
        component: PreCheckAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreCheckRoutingModule { }

export const PreCheckComponents = [
  PreCheckSearchPanelComponent, PreCheckComponent, PreCheckListComponent, PreCheckAddEditComponent
];
