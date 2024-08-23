import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-job-card-search-panel',
  templateUrl: './search-panel.component.html',

})
export class JobCardSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "jobTitle,assignedTo,status";

  updateSearchTerms(key: string, value: any) {
    this.searchData[key] = value;
    this.searchChanged.emit(this.searchData);
  }
}
