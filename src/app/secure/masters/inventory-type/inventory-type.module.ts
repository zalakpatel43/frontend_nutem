import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { InventoryTypeComponents, InventoryTypeRoutingModule } from './inventory-type-routing.module';
import { InventoryTypeService } from './inventory-type.service';

@NgModule({
    declarations: [
        ...InventoryTypeComponents
    ],
    imports: [
        SharedModule,
        InventoryTypeRoutingModule
    ],
    providers: [
        InventoryTypeService
    ]
})
export class InventoryTypeModule { }