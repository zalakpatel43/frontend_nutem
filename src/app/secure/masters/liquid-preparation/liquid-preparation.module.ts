import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidPreparationComponents, LiquidPreparationRoutingModule } from './liquid-preparation-routing.module';
import { SharedModule } from '@app-shared';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LiquidPreparationService } from './liquid-preparation.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    [...LiquidPreparationComponents]
  ],
  imports: [
    CommonModule,
    LiquidPreparationRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    MatTabsModule            
  ],
  providers: [
      LiquidPreparationService,
      provideEnvironmentNgxMask(),
  ]
})
export class LiquidPreparationModule { }
