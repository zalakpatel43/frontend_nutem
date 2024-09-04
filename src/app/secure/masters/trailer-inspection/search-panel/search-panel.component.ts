import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'trailer-inspection-search-panel',
  // standalone: true,
  // imports: [],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss'
})
export class TrailerInspectionSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "startDateTime , endDateTime, shiftName";

  updateSearchTerms(key: string, value: any) {
      this.searchData[key] = value;
      this.searchChanged.emit(this.searchData);
  }
}
