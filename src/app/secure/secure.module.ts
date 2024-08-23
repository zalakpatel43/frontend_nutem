import { NgModule } from '@angular/core';
import { SecureComponents, SecureRoutingModule } from './secure-routing.module';
import { LayoutModule } from '../layout';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule, AlertBoxService } from '@app-shared';
import { NgxMaskDirective,NgxMaskPipe } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { PublicService } from '../public/public.service';
import { UserAuthService } from '@app-core';
import { SecureService } from './secure.service';


@NgModule({
    declarations: [
        [...SecureComponents]
    ],
    imports: [
        LayoutModule,
        SecureRoutingModule,
        SharedModule,
        NgSelectModule,
        ModalModule.forRoot(),
        NgxMaskDirective,NgxMaskPipe
       
    ],
    providers: [
        PublicService,
        SecureService,
        AlertBoxService,
        UserAuthService
    ]
})
export class SecureModule { }