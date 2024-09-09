import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionOrderComponent } from './production-order/production-order.component';
import { ApplicationPage, PageAuthGuard } from '@app-core';
import { ProductionOrderListComponent } from './list/list.component';
import { ProductionOrderSearchPanelComponent } from './search-panel/search-panel.component';

const routes: Routes = [
  {
    path: '',
    component: ProductionOrderComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: ProductionOrderListComponent,
        canActivate: [PageAuthGuard],
        data: { page: ApplicationPage.productionOrder, title: 'Production Order' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionOrderRoutingModule { }

export const ProductionOrderComponents = [
  ProductionOrderSearchPanelComponent, ProductionOrderComponent, ProductionOrderListComponent
];
