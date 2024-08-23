import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BOMComponent } from './bom.component';
import { BOMAddEditComponent } from './add-edit/add-edit.component';
import { BOMListComponent } from './list/list.component';
import { BOMSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// routes
const routes: Routes = [
    {
        path: '',
        component: BOMComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: BOMListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.bom, action: PermissionType.list, title: 'BOM' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.bom, action: PermissionType.create, title: 'BOM' },
                component: BOMAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.bom, action: PermissionType.edit, title: 'BOM' },
                component: BOMAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BOMRoutingModule { }

export const BOMComponents = [
    BOMComponent, BOMListComponent, BOMAddEditComponent,
    BOMSearchPanelComponent
];
