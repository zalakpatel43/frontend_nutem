import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductAddEditComponent } from './add-edit/add-edit.component';
import { ProductListComponent } from './list/list.component';
import { ProductSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// routes
const routes: Routes = [
    {
        path: '',
        component: ProductComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: ProductListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.product, action: PermissionType.list, title: 'Product' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.product, action: PermissionType.create, title: 'Product' },
                component: ProductAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.product, action: PermissionType.edit, title: 'Product' },
                component: ProductAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }

export const ProductComponents = [
    ProductComponent, ProductListComponent, ProductAddEditComponent,
    ProductSearchPanelComponent
];
