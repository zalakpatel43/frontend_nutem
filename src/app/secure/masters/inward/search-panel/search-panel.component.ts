import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'inward-search-panel',
    templateUrl: './search-panel.component.html'
})
export class InwardSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "inwardCode,inventoryTypeName,fromWarehouseName,customerName,vendorName,warehouseName,supportingDocumentNo";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}