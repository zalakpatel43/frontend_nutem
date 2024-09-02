import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DowntimeTrackingComponents,DowntimeTrackingRoutingModule } from './downtime-routing.module';
import { DowntimeTrackingComponent } from './downtime/downtime.component';
import { SharedModule } from '@app-shared';
import { DowntimeTrackingService } from './downtime.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    [...DowntimeTrackingComponents]
  ],
  imports: [
    CommonModule,
    DowntimeTrackingRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
      DowntimeTrackingService,
      provideEnvironmentNgxMask(),
  ]
})
export class DowntimeTrackingModule { }
