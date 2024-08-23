import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { QualityParameterComponents, QualityParameterRoutingModule } from './quality-parameter-routing.module';
import { QualityParameterService } from './quality-parameter.service';

@NgModule({
  declarations: [
    ...QualityParameterComponents
  ],
  imports: [
    SharedModule,
    QualityParameterRoutingModule
  ],
  providers: [
    QualityParameterService
  ]
})
export class QualityParameterModule { }
