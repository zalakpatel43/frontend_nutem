import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';  // Adjust the import path as necessary
import { TermsAndConditionsComponents, TermsAndConditionsRoutingModule } from './terms-conditions-routing.module';
import { TermsAndConditionsService } from './terms-conditions.service';

@NgModule({
    declarations: [
        ...TermsAndConditionsComponents
    ],
    imports: [
        SharedModule,
        TermsAndConditionsRoutingModule
    ],
    providers: [
        TermsAndConditionsService
    ]
})
export class TermsAndConditionsModule { }
