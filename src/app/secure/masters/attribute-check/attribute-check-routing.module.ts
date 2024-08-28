import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttributeCHeckComponent } from './attribute-check/attribute-check.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { AttributeCheckListComponent } from './list/list.component';
import { AttributeCheckAddEditComponent } from './add-edit/add-edit.component';
import { AttributeCheckSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
      path: '',
      component: AttributeCHeckComponent,
      children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {
              path: 'list',
              component: AttributeCheckListComponent,
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.attributeCheck, title: 'AttributeCheck' }
          },
          {
              path: 'add',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.attributeCheck,  title: 'AttributeCheck' },
              component: AttributeCheckAddEditComponent
          },
          {
              path: 'edit/:id',
              canActivate: [PageAuthGuard],
              data: { page: ApplicationPage.attributeCheck,  title: 'AttributeCheck' },
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