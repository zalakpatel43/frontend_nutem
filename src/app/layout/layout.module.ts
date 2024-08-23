import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { SharedModule } from '@app-shared';
import { PublicHeaderBarComponent } from './public-header-bar/public-header-bar.component';
import { AppService } from '../app.service';

const shared = [HeaderBarComponent, FooterBarComponent, PublicHeaderBarComponent];

@NgModule({
    declarations: [
        ...shared,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        ...shared
    ],
    providers: [
        AppService
    ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class LayoutModule { }