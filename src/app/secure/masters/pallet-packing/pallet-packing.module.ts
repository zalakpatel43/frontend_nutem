import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalletPackingComponent } from './pallet-packing/pallet-packing.component';
import { PalletPackingComponents,PalletPackingRoutingModule } from './pallet-packing-routing.module';
import { SharedModule } from '@app-shared';
import { PalletPackingService } from './pallet-packing.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideEnvironmentNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
   [...PalletPackingComponents]
  ],
  imports: [
    CommonModule,
    PalletPackingRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    PalletPackingService,
    provideEnvironmentNgxMask(),
  ]
})
export class PalletPackingModule { }
