import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'terms-and-conditions-search-panel',
    templateUrl: './search-panel.component.html'
})
export class TermsAndConditionsSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "code,name,typeName,categoryName";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}