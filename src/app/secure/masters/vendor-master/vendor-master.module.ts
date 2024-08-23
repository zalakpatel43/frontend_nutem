import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { VendorMasterComponents, VendorMasterRoutingModule } from './vendor-master-routing.module';
import { VendorMasterService } from './vendor-master.service';
import { TermsAndConditionsService } from '../terms-conditions/terms-conditions.service';

@NgModule({
  declarations: [
    ...VendorMasterComponents
  ],
  imports: [
    SharedModule,
    VendorMasterRoutingModule
  ],
  providers: [
    VendorMasterService,
    TermsAndConditionsService
  ]
})
export class VendorMasterModule { }