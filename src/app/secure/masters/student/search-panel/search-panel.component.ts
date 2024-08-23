import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'student-search-panel',
    templateUrl: './search-panel.component.html'
})
export class StudentSearchPanelComponent {

    @Output() searchChanged = new EventEmitter();
    searchData: { [key: string]: any } = {};
    searchKey = "studentName,studentNumber";

    updateSearchTerms(key: string, value: any) {
        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
