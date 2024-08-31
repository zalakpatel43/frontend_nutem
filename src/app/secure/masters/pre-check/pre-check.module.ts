import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PreCheckComponents, PreCheckRoutingModule } from './pre-check-routing.module';
import { PreCheckComponent } from './pre-check/pre-check.component';
import { SharedModule } from '@app-shared';
import { PreCheckService } from './pre-check.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    [...PreCheckComponents]
  ],
  imports: [
    CommonModule,
    PreCheckRoutingModule,
    SharedModule,NgxDatatableModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    PreCheckService,
    provideEnvironmentNgxMask(),
  ]
})
export class PreCheckModule { }
