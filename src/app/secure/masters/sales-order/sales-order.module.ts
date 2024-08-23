import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { SalesOrderComponents, SalesOrderRoutingModule } from './sales-order-routing.module';
import { SalesOrderService } from './sales-order.service';

@NgModule({
    declarations: [
        ...SalesOrderComponents
    ],
    imports: [
        SharedModule,
        SalesOrderRoutingModule
    ],
    providers: [
        SalesOrderService
    ]
})
export class SalesOrderModule { }
