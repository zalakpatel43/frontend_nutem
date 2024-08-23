import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { NgxMaskDirective,NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { UserComponents, UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';

@NgModule({
    declarations: [
        [...UserComponents]
    ],
    imports: [
        SharedModule,
        NgxMaskDirective,NgxMaskPipe,
        UserRoutingModule,
    ],
    providers: [
        UserService,
        RoleService,
        provideEnvironmentNgxMask(),
    ]
})
export class UserModule {

}