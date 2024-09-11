import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionComponents, PermissionRoutingModule } from './permission-routing.module';
import { PermissionComponent } from './permission/permission.component';
import { SharedModule } from '@app-shared';
import { PermissionService } from './permission.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    ...PermissionComponents
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    PermissionService,
    provideEnvironmentNgxMask(),
  ]
})
export class PermissionModule { }
