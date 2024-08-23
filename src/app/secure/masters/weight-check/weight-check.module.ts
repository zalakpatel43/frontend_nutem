import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeighCheckComponents, WeightCheckRoutingModule } from './weight-check-routing.module';
import { SharedModule } from '@app-shared';
import { WeightCheckService } from './weight-check.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    ...WeighCheckComponents
  ],
  imports: [
    CommonModule,
    WeightCheckRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
      WeightCheckService
  ]
})
export class WeightCheckModule { }
