import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location.component';
import { LocationAddEditComponent } from './add-edit/add-edit.component';
import { LocationListComponent } from './list/list.component';
import { LocationSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

const routes: Routes = [
    {
        path: '',
        component: LocationComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: LocationListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.location, action: PermissionType.list, title: 'Location' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.location, action: PermissionType.create, title: 'Location' },
                component: LocationAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.location, action: PermissionType.edit, title: 'Location' },
                component: LocationAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LocationRoutingModule { }

export const LocationComponents = [
    LocationComponent, LocationListComponent, LocationAddEditComponent,
    LocationSearchPanelComponent
];
