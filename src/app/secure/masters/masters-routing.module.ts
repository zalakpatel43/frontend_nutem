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
                path: 'permissions',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.permission, action: PermissionType.edit },
                loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule)
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
                path: 'group-code',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.group_code, action: PermissionType.list },
                loadChildren: () => import('./group-code/group-code.module').then(m => m.GroupCodeModule)
            },
            {
                path: 'company',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.company, action: PermissionType.list },
                loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
            },
            {
                path: 'module',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.module, action: PermissionType.list },
                loadChildren: () => import('./module/module.module').then(m => m.ModuleModule)
            },
            {
                path: 'student',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.student, action: PermissionType.list },
                loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
            },
            {
                path: 'module-group',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.moduleGroup, action: PermissionType.list },
                loadChildren: () => import('./module-group/module-group.module').then(m => m.ModuleGroupModule)
            },
            {
                path: 'weight-check',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.weightCheck },
                loadChildren: () => import('./weight-check/weight-check.module').then(m => m.WeightCheckModule)
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
                path: 'bom',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.bom, action: PermissionType.list },
                loadChildren: () => import('./bom/bom.module').then(m => m.BOMModule)
            },
            {
                path: 'terms-conditions',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.termsAndConditions, action: PermissionType.list },
                loadChildren: () => import('./terms-conditions/terms-conditions.module').then(m => m.TermsAndConditionsModule)
            },
            {
                path: 'customer',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.customer, action: PermissionType.list },
                loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
            },
            {
                path: 'product',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.product, action: PermissionType.list },
                loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
            },
            {
                path: 'sales-order',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.salesOrder, action: PermissionType.list },
                loadChildren: () => import('./sales-order/sales-order.module').then(m => m.SalesOrderModule)
            },
            {
                path: 'vendor-master',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.vendorMaster, action: PermissionType.list },
                loadChildren: () => import('./vendor-master/vendor-master.module').then(m => m.VendorMasterModule)
            },
            {
                path: 'workflow',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.workflow, action: PermissionType.list },
                loadChildren: () => import('./workflow/workflow.module').then(m => m.WorkflowModule)
            },
            {
                path: 'purchase-order',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.purchaseOrder, action: PermissionType.list },
                loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule)
            },
            {
                path: 'inventory-type',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inventoryType, action: PermissionType.list },
                loadChildren: () => import('./inventory-type/inventory-type.module').then(m => m.InventoryTypeModule)
            },
            {
                path: 'inward',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.inward, action: PermissionType.list },
                loadChildren: () => import('./inward/inward.module').then(m => m.InwardModule)
            },
            {
                path: 'outward',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.outward, action: PermissionType.list },
                loadChildren: () => import('./outward/outward.module').then(m => m.OutwardModule)
            },
            {
                path: 'quality-parameter',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.qualityParameter, action: PermissionType.list },
                loadChildren: () => import('./quality-parameter/quality-parameter.module').then(m => m.QualityParameterModule)
            },
            {
                path: 'material-requisition',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.materialRequisition, action: PermissionType.list },
                loadChildren: () => import('./material-requisition/material-requisition.module').then(m => m.MaterialRequisitionModule)
            },
            {
                path: 'location',
                canActivate: [PageAuthGuard],
                data: { page: ApplicationPage.location, action: PermissionType.list },
                loadChildren: () => import('./location/location.module').then(m => m.LocationModule)
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