import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'trailer-loading-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class TrailerLoadingSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "TLDateTime, DoorNo, TrailerNo, BOLNo, SupervisedBy, SupervisedOn";

  updateSearchTerms(key: string, value: any) {
      this.searchData[key] = value;
      this.searchChanged.emit(this.searchData);
  }
}
