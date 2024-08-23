import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { LocationComponents, LocationRoutingModule } from './location-routing.module';
import { LocationService } from './location.service';
import { InventoryTypeService } from '../inventory-type/inventory-type.service';

@NgModule({
    declarations: [
        ...LocationComponents
    ],
    imports: [
        SharedModule,
        LocationRoutingModule
    ],
    providers: [
        LocationService,
        InventoryTypeService
    ]
})
export class LocationModule { }
