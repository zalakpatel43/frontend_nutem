import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightCheckComponent } from './weight-check/weight-check.component';
import { WeightCheckListComponent } from './list/list.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { WeightCheckAddEditComponent } from './add-edit/add-edit.component';
import { WeightCheckSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
      path: '',
      component: WeightCheckComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: WeightCheckListComponent,
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.weightCheck, title: 'WeightCheck' }
          },
          {
              path: 'add',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.weightCheck,  title: 'WeightCheck' },
              component: WeightCheckAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.weightCheck,  title: 'WeightCheck' },
              component: WeightCheckAddEditComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightCheckRoutingModule { }

export const WeighCheckComponents = [
  WeightCheckSearchPanelComponent, WeightCheckComponent, WeightCheckListComponent,
   WeightCheckAddEditComponent
  
];

