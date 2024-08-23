import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { WorkflowRoutingModule, WorkflowComponents } from './workflow-routing.module';
import { WorkflowService } from './workflow.service';
import { ModuleGroupService } from '../module-group/module-group.service';

@NgModule({
    declarations: [
        ...WorkflowComponents
    ],
    imports: [
        SharedModule,
        WorkflowRoutingModule
    ],
    providers: [
        WorkflowService,
        ModuleGroupService
    ]
})
export class WorkflowModule { }
