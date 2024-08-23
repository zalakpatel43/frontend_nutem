import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlertBoxComponent } from '../shared/components';
import { AppResolver } from '../app-resolver.service';
import { AuthGuard } from '@app-core'

//routes
const routes: Routes = [
    {
        path: '',
        component: SecureComponent,
        canActivate: [AuthGuard],
        resolve: { 'themeData': AppResolver },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
            {
                path: 'masters',
                loadChildren: () => import('./masters/masters.module').then(m => m.MastersModule),
                resolve: { 'themeData': AppResolver }
            },           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AppResolver]
})

export class SecureRoutingModule { }

export const SecureComponents = [
    SecureComponent, DashboardComponent
];