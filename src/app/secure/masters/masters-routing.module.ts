import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPage, AuthGuard, PageAuthGuard, PermissionType } from '@app-core';
import { ChangeCredentialsComponent } from './change-credentials/change-credentials.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MastersComponent } from './masters.component';

//routes
const routes: Routes = [
    {
        path: '',
        component: MastersComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'town', pathMatch: 'full' },
            {
                path: 'user',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.user, action: PermissionType.list },
                loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            },
            {
                path: 'role',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.role, action: PermissionType.list },
                loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
                data: { title: 'Change Password' }
            },
            {
                path: 'change-credential',
                component: ChangeCredentialsComponent,
                data: { title: 'Change Credentials' }
            },
            {
                path: 'company',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.company, action: PermissionType.list },
                loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
            },
            {
                path: 'weight-check',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.weightCheck },
                loadChildren: () => import('./weight-check/weight-check.module').then(m => m.WeightCheckModule)
            },
            {
                path: 'permission',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.permissioon },
                loadChildren: () => import('./permission/permission.module').then(m => m.PermissionModule)
            },
            {
                path: 'pallet-packing',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.palletPacking },
                loadChildren: () => import('./pallet-packing/pallet-packing.module').then(m => m.PalletPackingModule)
            },
            {
                path: 'attribute-check',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.attributeCheck },
                loadChildren: () => import('./attribute-check/attribute-check.module').then(m => m.AttributeCheckModule)
            },
            {
                path: 'trailer-inspection',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.trailerInspection },
                loadChildren: () => import('./trailer-inspection/trailer-inspection.module').then(m => m.TrailerInspectionModule)
            },
            {
                path: 'trailor-loading',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.trailerLoading },
                loadChildren: () => import('./trailor-loading/trailor-loading.module').then(m => m.TrailerLoadingModule)
            },
            
            {
                path: 'downtimeTracking',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.downtimeTracking },
                loadChildren: () => import('./downtime/downtime.module').then(m => m.DowntimeTrackingModule)
            },
            {
                path: 'liquid-preparation',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.liquidPreparation },
                loadChildren: () => import('./liquid-preparation/liquid-preparation.module').then(m => m.LiquidPreparationModule)
            },
            {
                path: 'pre-check',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.preCheck },
                loadChildren: () => import('./pre-check/pre-check.module').then(m => m.PreCheckModule)
            },
            {
                path: 'production-order',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.productionOrder },
                loadChildren: () => import('./production-order/production-order.module').then(m => m.ProductionOrderModule)
              },
            {
                path: 'post-check',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.postCheck },
                loadChildren: () => import('./post-check/post-check.module').then(m => m.PostCheckModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MastersRoutingModule { }

export const MastersComponents = [
    MastersComponent, ChangePasswordComponent, ChangeCredentialsComponent
];