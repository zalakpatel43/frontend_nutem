import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { CommonModule } from '@angular/common';
import { RoleComponents, RoleRoutingModule } from './role-routing.module';
import { RoleService } from './role.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
    declarations: [
        [...RoleComponents]
    ],
    imports: [
        SharedModule,
        RoleRoutingModule,CommonModule,NgxDatatableModule 
    ],
    providers: [
        RoleService,provideEnvironmentNgxMask()
    ]
})
export class RoleModule { }