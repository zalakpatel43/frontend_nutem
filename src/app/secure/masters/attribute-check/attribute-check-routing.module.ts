import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributeCHeckComponent } from './attribute-check/attribute-check.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { AttributeCheckListComponent } from './list/list.component';
import { AttributeCheckAddEditComponent } from './add-edit/add-edit.component';
import { AttributeCheckSearchPanelComponent } from './search-panel/search-panel.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

const routes: Routes = [
  {
      path: '',
      component: AttributeCHeckComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: AttributeCheckListComponent,
              canActivate: [PermissionGuard],
              data: { permission: 'Attribute Check (PER_ATTRIBUTECHECK) - View' },
          },
          {
              path: 'add',
              canActivate: [PermissionGuard],
              data: { permission: 'Attribute Check (PER_ATTRIBUTECHECK) - Add' },
              component: AttributeCheckAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PermissionGuard],
              data: { permission: 'Attribute Check (PER_ATTRIBUTECHECK) - Edit' },
              component: AttributeCheckAddEditComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributeCheckRoutingModule { }

export const AttributeCheckComponents = [
  AttributeCheckSearchPanelComponent, AttributeCHeckComponent, AttributeCheckListComponent,
   AttributeCheckAddEditComponent
  
];