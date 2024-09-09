import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidPreparationComponents, LiquidPreparationRoutingModule } from './liquid-preparation-routing.module';
import { SharedModule } from '@app-shared';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LiquidPreparationService } from './liquid-preparation.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from "@angular/material-moment-adapter";


@NgModule({
  declarations: [
    [...LiquidPreparationComponents]
  ],
  imports: [
    CommonModule,
    LiquidPreparationRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    MatTabsModule,
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
      LiquidPreparationService,
      provideEnvironmentNgxMask(),
  ]
})
export class LiquidPreparationModule { }
