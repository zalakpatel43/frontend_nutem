import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { RoleAddEditComponent } from './add-edit/add-edit.component';
import { RoleListComponent } from './list/list.component';
import { RoleSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

//routes
const routes: Routes = [
    {
        path: '',
        component: RoleComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: RoleListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.role, action: PermissionType.list,title: 'Role' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.role, action: PermissionType.create, title: 'Role' },
                component: RoleAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.role, action: PermissionType.edit, title: 'Role' },
                component: RoleAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule { }


export const RoleComponents = [
    RoleComponent, RoleListComponent, RoleAddEditComponent,
    RoleSearchPanelComponent
]; 