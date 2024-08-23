import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'location-search-panel',
    templateUrl: './search-panel.component.html'
})
export class LocationSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "locationCode,locationName,companyName,city,stateName,countryName,pincode";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}