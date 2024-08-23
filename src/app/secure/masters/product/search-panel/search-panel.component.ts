import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'product-search-panel',
    templateUrl: './search-panel.component.html'
})
export class ProductSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "productCode,productName,productCategory,productType,productBrand,hsnCode";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
