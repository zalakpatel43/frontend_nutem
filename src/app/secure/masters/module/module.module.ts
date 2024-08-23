import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { ModuleComponents, ModuleRoutingModule } from './module-routing.module';
import { ModuleService } from './module.service';

@NgModule({
    declarations: [
        ...ModuleComponents
    ],
    imports: [
        SharedModule,
        ModuleRoutingModule
    ],
    providers: [
        ModuleService
    ]
})
export class ModuleModule { }
