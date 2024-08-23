import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleComponent } from './module.component';
import { ModuleAddEditComponent } from './add-edit/add-edit.component';
import { ModuleListComponent } from './list/list.component';
import { ModuleSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// routes
const routes: Routes = [
    {
        path: '',
        component: ModuleComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: ModuleListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.module, action: PermissionType.list, title: 'Module' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.module, action: PermissionType.create, title: 'Module' },
                component: ModuleAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.module, action: PermissionType.edit, title: 'Module' },
                component: ModuleAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModuleRoutingModule { }

export const ModuleComponents = [
    ModuleComponent, ModuleListComponent, ModuleAddEditComponent,
    ModuleSearchPanelComponent
];
