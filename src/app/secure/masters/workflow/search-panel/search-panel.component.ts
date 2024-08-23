import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'workflow-search-panel',
    templateUrl: './search-panel.component.html'
})
export class WorkflowSearchPanelComponent {
    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey: string = 'workflowCode,transactionName,remarks';

    updateSearchTerms(key: string, value) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}