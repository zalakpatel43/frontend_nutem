import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'inventory-type-search-panel',
    templateUrl: './search-panel.component.html'
})
export class InventoryTypeSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "inventoryTypeCode,inventoryTypeName,applicableToName,inwardType,sales,purchase,reserve,admin";

    updateSearchTerms(key: string, value) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}