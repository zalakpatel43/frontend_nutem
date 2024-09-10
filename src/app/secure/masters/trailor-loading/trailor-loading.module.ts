import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerLoadingComponent } from './trailor-loading/trailor-loading.component';
import { TrailerLoadingComponents,TrailerLoadingRoutingModule } from './trailor-loading-routing.module';
import { SharedModule } from '@app-shared';
import { TrailerLoadingService } from './trailor-loading.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    [...TrailerLoadingComponents]
  ],
  imports: [
    CommonModule,
    TrailerLoadingRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    TrailerLoadingService,
    provideEnvironmentNgxMask(),
  ]
})
export class TrailerLoadingModule { }
