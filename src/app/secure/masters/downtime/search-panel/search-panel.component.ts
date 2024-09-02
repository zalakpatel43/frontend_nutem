import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'downtime-tracking-search-panel',
  // standalone: true,
  // imports: [],
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class DowntimeTrackingSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "startDateTime, endDateTime, shiftName, productionOrder, fillingLine";

  updateSearchTerms(key: string, value: any) {
      this.searchData[key] = value;
      this.searchChanged.emit(this.searchData);
  }
}
