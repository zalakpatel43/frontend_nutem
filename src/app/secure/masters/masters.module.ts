import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { MastersComponents, MastersRoutingModule } from './masters-routing.module';
import { MasterService } from './masters.service';
import { ModuleGroupComponent } from './module-group/module-group.component';

@NgModule({
    declarations: [
        [...MastersComponents
  ]
    ],
    imports: [
        SharedModule,
        MastersRoutingModule
    ],
    providers: [
        MasterService
    ]
})
export class MastersModule { }