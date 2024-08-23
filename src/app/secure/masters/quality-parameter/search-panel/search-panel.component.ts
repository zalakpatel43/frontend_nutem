import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'quality-parameter-search-panel',
    templateUrl: './search-panel.component.html'
})
export class QualityParameterSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "qualityParameterCode,drawingNumber,product,revisionNo,createdByUser";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
