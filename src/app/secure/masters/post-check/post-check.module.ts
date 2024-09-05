import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PostCheckComponents, PostCheckRoutingModule } from './post-check-routing.module';
import { PostCheckComponent } from './post-check/post-check.component';
import { SharedModule } from '@app-shared';
import { PostCheckService } from './post-check.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    [...PostCheckComponents]
  ],
  imports: [
    CommonModule,MatFormFieldModule,
    PostCheckRoutingModule,MatInputModule,
    SharedModule,NgxDatatableModule,
    NgxMaterialTimepickerModule,NgxMatDatetimePickerModule,NgxMatTimepickerModule
    ,MatNativeDateModule,MatMomentDateModule,NgxMatMomentModule
    
  ],
  providers: [
    PostCheckService,NgxMatNativeDateModule,
    provideEnvironmentNgxMask(),
  ]
})
export class PostCheckModule { }
