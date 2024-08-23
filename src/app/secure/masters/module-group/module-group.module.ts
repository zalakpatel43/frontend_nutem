import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { ModuleGroupComponents, ModuleGroupRoutingModule } from './module-group-routing.module';
import { ModuleGroupService } from './module-group.service';

@NgModule({
    declarations: [
        ...ModuleGroupComponents
    ],
    imports: [
        SharedModule,
        ModuleGroupRoutingModule
    ],
    providers: [
        ModuleGroupService
    ]
})
export class ModuleGroupModule { }
