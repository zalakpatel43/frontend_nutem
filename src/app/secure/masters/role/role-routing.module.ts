import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { RoleAddEditComponent } from './add-edit/add-edit.component';
import { RoleListComponent } from './list/list.component';
import { RoleSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

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
                canActivate: [PermissionGuard],
                data: { permission: 'Role (PER_ROLE) - View' },
            },
            {
                path: 'add',
                canActivate: [PermissionGuard],
                data: { permission: 'Role (PER_ROLE) - Add' },
                component: RoleAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PermissionGuard],
                data: { permission: 'Role (PER_ROLE) - Edit' },
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