import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pallet-packing-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class PalletPackingSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "startDateTime, endDateTime, shiftName";

  updateSearchTerms(key: string, value: any) {
      this.searchData[key] = value;
      this.searchChanged.emit(this.searchData);
  }
}
