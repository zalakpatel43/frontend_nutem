import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { InwardComponents, InwardRoutingModule } from './inward-routing.module';
import { InwardService } from './inward.service';
import { InventoryTypeService } from '../inventory-type/inventory-type.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';

@NgModule({
    declarations: [
        ...InwardComponents
    ],
    imports: [
        SharedModule,
        InwardRoutingModule
    ],
    providers: [
        InwardService,
        InventoryTypeService,
        PurchaseOrderService
    ]
})
export class InwardModule { }