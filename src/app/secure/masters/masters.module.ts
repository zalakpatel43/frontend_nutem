import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { MastersComponents, MastersRoutingModule } from './masters-routing.module';
import { MasterService } from './masters.service';
import { ModuleGroupComponent } from './module-group/module-group.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatNativeDateModule } from '@angular/material/core'
@NgModule({
    declarations: [
        [...MastersComponents
  ]
    ],
    imports: [
        SharedModule,
        MastersRoutingModule,
        NgxMaterialTimepickerModule,MatNativeDateModule
    ],
    providers: [
        MasterService
    ]
})
export class MastersModule { }