import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './permissions.component';
import { PermissionsAddEditComponent } from './add-edit/add-edit.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

//routes
const routes: Routes = [
    {
        path: '',
        component: PermissionsComponent,
        children: [
            { path: '', redirectTo: 'add-edit', pathMatch: 'full' },
            {
                path: 'add-edit',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.permission, action: PermissionType.edit, title: 'Permissions' },
                component: PermissionsAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PermissionsRoutingModule { }


export const PermissionsComponents = [
    PermissionsAddEditComponent, PermissionsComponent
]; 