import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { LiquidPreparationComponent } from './liquid-preparation/liquid-preparation.component';
import { LiquidPreparationListComponent } from './list/list.component';
import { LiquidPreparationAddEditComponent } from './add-edit/add-edit.component';
import { LiquidPreparationSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LiquidPreparationComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: LiquidPreparationListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'Liquid Preparation (PER_LIQUIDPREPARATION) - View' },
      },
      {
        path: 'add',
        canActivate: [PermissionGuard],
        data: { permission: 'Liquid Preparation (PER_LIQUIDPREPARATION) - Add' },
        component: LiquidPreparationAddEditComponent
      },
      {
        path: 'edit/:id',
        canActivate: [PermissionGuard],
        data: { permission: 'Liquid Preparation (PER_LIQUIDPREPARATION) - Edit' },
        component: LiquidPreparationAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidPreparationRoutingModule { }

export const LiquidPreparationComponents = [
  LiquidPreparationAddEditComponent, LiquidPreparationComponent, LiquidPreparationListComponent,
  LiquidPreparationSearchPanelComponent

];