import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaborVarianceRoutingModule, LaborVarinaceComponents } from './labor-variance-routing.module';
import { SharedModule} from '@app-shared';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LaborVarianceService } from './labor-variance.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [...LaborVarinaceComponents],
  imports: [
    CommonModule,
    LaborVarianceRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
    providers: [
        LaborVarianceService,
        provideEnvironmentNgxMask(),
    ]
})
export class LaborVarianceModule { }
