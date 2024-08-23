import { NgModule } from '@angular/core';
import { SharedModule } from '@app-shared';
import { MaterialRequisitionComponents, MaterialRequisitionRoutingModule } from './material-requisition-routing.module';
import { MaterialRequisitionService } from './material-requisition.service';
import { CustomerService } from '../customer/customer.service';

@NgModule({
    declarations: [
        ...MaterialRequisitionComponents
    ],
    imports: [
        SharedModule,
        MaterialRequisitionRoutingModule
    ],
    providers: [
        MaterialRequisitionService,
        CustomerService
    ]
})
export class MaterialRequisitionModule { }
