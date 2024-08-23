import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sales-order-search-panel',
    templateUrl: './search-panel.component.html'
})
export class SalesOrderSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "salesOrderCode,customerPONumber";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
