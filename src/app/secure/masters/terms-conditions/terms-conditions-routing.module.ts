import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-conditions.component';
import { TermsAndConditionsAddEditComponent } from './add-edit/add-edit.component';
import { TermsAndConditionsListComponent } from './list/list.component';
import { TermsAndConditionsSearchPanelComponent } from './search-panel/search-panel.component';
import { ApplicationPage, PageAuthGuard, PermissionType } from '@app-core';

// Routes
const routes: Routes = [
    {
        path: '',
        component: TermsAndConditionsComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
                path: 'list',
                component: TermsAndConditionsListComponent,
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.termsAndConditions, action: PermissionType.list, title: 'Terms and Conditions' }
            },
            {
                path: 'add',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.termsAndConditions, action: PermissionType.create, title: 'Terms and Conditions' },
                component: TermsAndConditionsAddEditComponent
            },
            {
                path: 'edit/:id',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.termsAndConditions, action: PermissionType.edit, title: 'Terms and Conditions' },
                component: TermsAndConditionsAddEditComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TermsAndConditionsRoutingModule { }

export const TermsAndConditionsComponents = [
    TermsAndConditionsComponent,
    TermsAndConditionsListComponent,
    TermsAndConditionsAddEditComponent,
    TermsAndConditionsSearchPanelComponent
];
