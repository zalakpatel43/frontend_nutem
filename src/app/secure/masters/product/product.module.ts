import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { ProductComponents, ProductRoutingModule } from './product-routing.module';
import { ProductService } from './product.service';

@NgModule({
    declarations: [
        ...ProductComponents
    ],
    imports: [
        SharedModule,
        ProductRoutingModule
    ],
    providers: [
        ProductService
    ]
})
export class ProductModule { }
