import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PalletPackingComponent } from './pallet-packing/pallet-packing.component';
import { PalletPackingComponents,PalletPackingRoutingModule } from './pallet-packing-routing.module';
import { SharedModule } from '@app-shared';
import { PalletPackingService } from './pallet-packing.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
   [...PalletPackingComponents]
  ],
  imports: [
    CommonModule,
    PalletPackingRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgxMatMomentModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    PalletPackingService,
    provideEnvironmentNgxMask(),
  ]
})
export class PalletPackingModule { }
