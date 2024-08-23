import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { BOMComponents, BOMRoutingModule } from './bom-routing.module';
import { BOMService } from './bom.service';

@NgModule({
    declarations: [
        ...BOMComponents
    ],
    imports: [
        SharedModule,
        BOMRoutingModule
    ],
    providers: [
        BOMService
    ]
})
export class BOMModule { }
