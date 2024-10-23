import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pallet-packing-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class PalletPackingSearchPanelComponent {

  @Output() searchChanged = new EventEmitter<{ [key: string]: any }>();
  searchData: { [key: string]: any } = {};

  // Function to update search terms dynamically
  updateSearchTerms(key: string, value: any) {
    this.searchData[key] = value;
    this.searchChanged.emit(this.searchData);  // Emit the updated search data
  }
}
