import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { NgxMaskDirective,NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { UserComponents, UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
    declarations: [
        [...UserComponents]
    ],
    imports: [
        SharedModule,
        NgxMaskDirective,NgxMaskPipe,
        UserRoutingModule,MatTableModule,MatPaginatorModule
    ],
    providers: [
        UserService,
        RoleService,
        provideEnvironmentNgxMask(),
    ]
})
export class UserModule {

}