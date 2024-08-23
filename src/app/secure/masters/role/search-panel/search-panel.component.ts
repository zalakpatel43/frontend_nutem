import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'role-search-panel',
    templateUrl: './search-panel.component.html'
})

export class RoleSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "name";

    updateSearchTerms(key: string, value) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}