import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'weight-check-search-panel',
  // standalone: false,
  // imports: [],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss'
})
export class WeightCheckSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "customerCode,customerName,customerCategory,industry,customerType,phoneNo";

  updateSearchTerms(key: string, value: any) {
      this.searchData[key] = value;
      this.searchChanged.emit(this.searchData);
  }
}
