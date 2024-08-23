import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'group-code-search-panel',
    templateUrl: './search-panel.component.html'
})
export class GroupCodeSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "code,name,groupName,value";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
