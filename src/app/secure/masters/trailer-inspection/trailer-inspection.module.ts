import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrailerInspectionComponents, TrailerInspectionRoutingModule } from './trailer-inspection-routing.module';
import { TrailerInspectionComponent } from './trailer-inspection/trailer-inspection.component';
import { SharedModule } from '@app-shared';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TrailerInspectionService } from './trailer-inspection.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [
    [...TrailerInspectionComponents]
  ],
  imports: [
    CommonModule,
    TrailerInspectionRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    
  ],
  providers: [
      TrailerInspectionService,
      provideEnvironmentNgxMask(),
  ]
})
export class TrailerInspectionModule { }
