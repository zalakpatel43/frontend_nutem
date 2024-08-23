import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { RoleComponents, RoleRoutingModule } from './role-routing.module';
import { RoleService } from './role.service';

@NgModule({
    declarations: [
        [...RoleComponents]
    ],
    imports: [
        SharedModule,
        RoleRoutingModule
    ],
    providers: [
        RoleService
    ]
})
export class RoleModule { }