import { NgModule } from '@angular/core';
import { PermissionsComponents, PermissionsRoutingModule } from './permissions-routing.module';
import { SharedModule } from '@app-shared';
import { RoleService } from '../../masters/role/role.service';
import { AccordionModule } from 'ngx-bootstrap/accordion'

@NgModule({
    declarations: [
        [...PermissionsComponents]
    ],
    imports: [        
        AccordionModule.forRoot(),
        SharedModule,
        PermissionsRoutingModule
    ],
    providers: [
        RoleService
    ]
})
export class PermissionsModule { }