import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { GroupCodeComponents, GroupCodeRoutingModule } from './group-code-routing.module';
import { GroupCodeService } from './group-code.service';

@NgModule({
    declarations: [
        [...GroupCodeComponents],
    ],
    imports: [
        SharedModule,
        GroupCodeRoutingModule
    ],
    providers: [
        GroupCodeService
    ]
})

export class GroupCodeModule { }