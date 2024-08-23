import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PublicService } from './public.service';
import { PublicComponents, PublicRoutingModule } from './public-routing.module';
import { LayoutModule } from '../layout';
import { NgxMaskDirective,NgxMaskPipe } from 'ngx-mask'
import { CookieService } from 'ngx-cookie-service';


@NgModule({
    declarations: [
        [...PublicComponents]
    ],
    imports: [
        LayoutModule,
        PublicRoutingModule,
        SharedModule,
        NgxMaskDirective,NgxMaskPipe
    ],
    providers: [
        PublicService,
        CookieService
    ]
})
export class PublicModule { }