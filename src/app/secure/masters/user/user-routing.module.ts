import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { UserAddEditComponent } from './add-edit/add-edit.component';
import { UserListComponent } from './list/list.component';
import { UserSearchPanelComponent } from './search-panel/search-panel.component';
import { UserComponent } from './user.component';
import { PermissionGuard } from 'src/app/core/guards/permission-guard.service';

//routes
const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                canActivate: [PermissionGuard],
                data: { permission: 'User (PER_USER) - View' },
                component: UserListComponent,
            },
            {
                path: 'add',
                canActivate: [PermissionGuard],
                data: { permission: 'User (PER_USER) - Add' },
                component: UserAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PermissionGuard],
                data: { permission: 'User (PER_USER) - Edit' },
                component: UserAddEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }

export const UserComponents = [
    UserComponent, UserListComponent, UserAddEditComponent, UserSearchPanelComponent
];