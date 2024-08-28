import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeCheckComponents, AttributeCheckRoutingModule } from './attribute-check-routing.module';
import { AttributeCHeckComponent } from './attribute-check/attribute-check.component';
import { SharedModule } from '@app-shared';
import { AttributeCheckService } from './attribute-check.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    [...AttributeCheckComponents]
  ],
  imports: [
    CommonModule,
    AttributeCheckRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule

  ],
  providers: [
      AttributeCheckService,
      provideEnvironmentNgxMask(),
  ]
})
export class AttributeCheckModule { }
