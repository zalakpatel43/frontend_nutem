import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';
import { UserAddEditComponent } from './add-edit/add-edit.component';
import { UserListComponent } from './list/list.component';
import { UserSearchPanelComponent } from './search-panel/search-panel.component';
import { UserComponent } from './user.component';

//routes
const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                canActivate: [PageAuthGuard],
                component: UserListComponent,
                data: { page: ApplicationPage.user, action: PermissionType.list,title: 'User' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.user, action: PermissionType.create, title: 'User' },
                component: UserAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.user, action: PermissionType.edit, title: 'User' },
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