import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InwardComponent } from './inward.component';
import { InwardAddEditComponent } from './add-edit/add-edit.component';
import { InwardListComponent } from './list/list.component';
import { InwardSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

const routes: Routes = [
    {
        path: '',
        component: InwardComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: InwardListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inward, action: PermissionType.list, title: 'Inward' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inward, action: PermissionType.create, title: 'Inward' },
                component: InwardAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inward, action: PermissionType.edit, title: 'Inward' },
                component: InwardAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InwardRoutingModule { }

export const InwardComponents = [
    InwardComponent, InwardListComponent, InwardAddEditComponent,
    InwardSearchPanelComponent
];
