import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'module-group-search-panel',
    templateUrl: './search-panel.component.html'
})

export class ModuleGroupSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "name,code,moduleName,priority";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}