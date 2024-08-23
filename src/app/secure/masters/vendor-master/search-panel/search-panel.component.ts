import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'vendor-master-search-panel',
    templateUrl: './search-panel.component.html'
})
export class VendorMasterSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "vendorCode,vendorName,email,phone,mobile,baseAddress1,baseAddress2,city";

    updateSearchTerms(key: string, value) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}