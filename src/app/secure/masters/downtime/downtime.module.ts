import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DowntimeTrackingComponents,DowntimeTrackingRoutingModule } from './downtime-routing.module';
import { DowntimeTrackingComponent } from './downtime/downtime.component';
import { SharedModule } from '@app-shared';
import { DowntimeTrackingService } from './downtime.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    [...DowntimeTrackingComponents]
  ],
  imports: [
    CommonModule,
    DowntimeTrackingRoutingModule,
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
      DowntimeTrackingService,
      provideEnvironmentNgxMask(),
  ]
})
export class DowntimeTrackingModule { }
