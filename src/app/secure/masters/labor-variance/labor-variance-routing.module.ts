import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaborVarianceListComponent } from './list/list.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';
import { LaborVarianceAddEditComponent } from './add-edit/add-edit.component';
import { LaborVarianceSearchPanelComponent } from './search-panel/search-panel.component';
import { LaborVarianceComponent } from './labor-variance/labor-variance.component';

const routes: Routes = [
  {
      path: '',
      component: LaborVarianceComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: LaborVarianceListComponent,
              canActivate: [PermissionGuard],
              data: { permission: 'Production Order (PER_PURCHASEORDER) - View' },
             // data: { permission: 'Attribute Check (PER_ATTRIBUTECHECK) - View' },
          },
          {
              path: 'add',
              canActivate: [PermissionGuard],
              data: { permission: 'Production Order (PER_PURCHASEORDER) - View' },
             // data: { permission: 'Attribute Check (PER_ATTRIBUTECHECK) - Add' },
              component: LaborVarianceAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PermissionGuard],
              data: { permission: 'Production Order (PER_PURCHASEORDER) - View' },
             // data: { permission: 'Attribute Check (PER_ATTRIBUTECHECK) - Edit' },
              component: LaborVarianceAddEditComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaborVarianceRoutingModule { }

export const LaborVarinaceComponents = [
  LaborVarianceSearchPanelComponent, LaborVarianceComponent, LaborVarianceListComponent,
   LaborVarianceAddEditComponent
];
