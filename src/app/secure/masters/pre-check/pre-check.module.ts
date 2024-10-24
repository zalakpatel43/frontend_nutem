import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PreCheckComponents, PreCheckRoutingModule } from './pre-check-routing.module';
import { PreCheckComponent } from './pre-check/pre-check.component';
import { SharedModule } from '@app-shared';
import { PreCheckService } from './pre-check.service';
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
    [...PreCheckComponents]
  ],
  imports: [
    CommonModule,
    PreCheckRoutingModule,
    SharedModule,NgxDatatableModule,
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
    PreCheckService,
    provideEnvironmentNgxMask(),
  ]
})
export class PreCheckModule { }
