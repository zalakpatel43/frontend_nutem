import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bom-search-panel',
    templateUrl: './search-panel.component.html'
})
export class BOMSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "bomCode,name,finishedProduct";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
