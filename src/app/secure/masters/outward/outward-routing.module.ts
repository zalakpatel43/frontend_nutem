import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutwardComponent } from './outward.component';
import { OutwardAddEditComponent } from './add-edit/add-edit.component';
import { OutwardListComponent } from './list/list.component';
import { OutwardSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

const routes: Routes = [
    {
        path: '',
        component: OutwardComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: OutwardListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.outward, action: PermissionType.list, title: 'Outward' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.outward, action: PermissionType.create, title: 'Outward' },
                component: OutwardAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.outward, action: PermissionType.edit, title: 'Outward' },
                component: OutwardAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OutwardRoutingModule { }

export const OutwardComponents = [
    OutwardComponent, OutwardListComponent, OutwardAddEditComponent,
    OutwardSearchPanelComponent
];
