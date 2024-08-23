import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { NgxMaskDirective,NgxMaskPipe } from 'ngx-mask';
import { CompanyComponents, CompanyRoutingModule } from './company-routing.module';
import { CompanyService } from './company.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    declarations: [
        ...CompanyComponents
    ],
    imports: [
        SharedModule,
        NgxDatatableModule ,
        NgxMaskDirective,NgxMaskPipe,
        CompanyRoutingModule,
    ],
    providers: [
        CompanyService
    ]
})
export class CompanyModule {

}
