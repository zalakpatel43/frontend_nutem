import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'module-search-panel',
    templateUrl: './search-panel.component.html'
})
export class ModuleSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "name,code";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
