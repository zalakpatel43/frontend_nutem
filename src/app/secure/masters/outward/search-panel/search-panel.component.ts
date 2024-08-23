import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'outward-search-panel',
    templateUrl: './search-panel.component.html'
})
export class OutwardSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "outwardCode,inventoryTypeName,fromWarehouseName,customerName,vendorName,warehouseName,supportingDocumentNo";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}