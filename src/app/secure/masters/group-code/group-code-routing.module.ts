import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupCodeComponent } from './group-code.component';
import { GroupCodeAddEditComponent } from './add-edit/add-edit.component';
import { GroupCodeListComponent } from './list/list.component';
import { GroupCodeSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// routes
const routes: Routes = [
    {
        path: '',
        component: GroupCodeComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: GroupCodeListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.group_code, action: PermissionType.list, title: 'Group Code' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.group_code, action: PermissionType.create, title: 'Group Code' },
                component: GroupCodeAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.group_code, action: PermissionType.edit, title: 'Group Code' },
                component: GroupCodeAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupCodeRoutingModule { }

export const GroupCodeComponents = [
    GroupCodeComponent, GroupCodeListComponent, GroupCodeAddEditComponent,
    GroupCodeSearchPanelComponent
];
