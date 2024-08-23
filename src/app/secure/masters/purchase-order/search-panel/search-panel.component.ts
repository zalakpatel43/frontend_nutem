import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'purchase-order-search-panel',
    templateUrl: './search-panel.component.html'
})
export class PurchaseOrderSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "purchaseOrderCode,vendorPONumber,revisionNo";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
