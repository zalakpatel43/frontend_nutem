import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { PurchaseOrderComponents, PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderService } from './purchase-order.service';

@NgModule({
    declarations: [
        ...PurchaseOrderComponents
    ],
    imports: [
        SharedModule,
        PurchaseOrderRoutingModule
    ],
    providers: [
        PurchaseOrderService
    ]
})
export class PurchaseOrderModule { }
