import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleGroupComponent } from './module-group.component';
import { ModuleGroupAddEditComponent } from './add-edit/add-edit.component';
import { ModuleGroupListComponent } from './list/list.component';
import { ModuleGroupSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// Routes
const routes: Routes = [
    {
        path: '',
        component: ModuleGroupComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: ModuleGroupListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.moduleGroup, action: PermissionType.list, title: 'Module Group' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.moduleGroup, action: PermissionType.create, title: 'Module Group' },
                component: ModuleGroupAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.moduleGroup, action: PermissionType.edit, title: 'Module Group' },
                component: ModuleGroupAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModuleGroupRoutingModule { }

export const ModuleGroupComponents = [
    ModuleGroupComponent, ModuleGroupListComponent, ModuleGroupAddEditComponent,
    ModuleGroupSearchPanelComponent
];
