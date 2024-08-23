import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { CustomerRoutingModule, CustomerComponents } from './customer-routing.module';
import { CustomerService } from './customer.service';

@NgModule({
    declarations: [
        ...CustomerComponents
    ],
    imports: [
        SharedModule,
        CustomerRoutingModule
    ],
    providers: [
        CustomerService
    ]
})
export class CustomerModule { }
