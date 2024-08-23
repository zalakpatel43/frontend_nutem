import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { OutwardComponents, OutwardRoutingModule } from './outward-routing.module';
import { OutwardService } from './outward.service';
import { InventoryTypeService } from '../inventory-type/inventory-type.service';

@NgModule({
    declarations: [
        ...OutwardComponents
    ],
    imports: [
        SharedModule,
        OutwardRoutingModule
    ],
    providers: [
        OutwardService,
        InventoryTypeService
    ]
})
export class OutwardModule { }
