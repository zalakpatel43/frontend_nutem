import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'customer-search-panel',
    templateUrl: './search-panel.component.html'
})
export class CustomerSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "customerCode,customerName,customerCategory,industry,customerType,phoneNo";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
