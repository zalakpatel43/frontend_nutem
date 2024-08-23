import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'material-requisition-search-panel',
    templateUrl: './search-panel.component.html'
})
export class MaterialRequisitionSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "materialRequisitionCode,warehouseName,customerName,shippingAddress,billingAddress";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
