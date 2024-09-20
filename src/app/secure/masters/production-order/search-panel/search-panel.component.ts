import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'production-order-search-panel',
  templateUrl: './search-panel.component.html'
})
export class ProductionOrderSearchPanelComponent {
  @Output() searchChanged = new EventEmitter<{ [key: string]: any }>();
  searchData: { [key: string]: any } = {};

  // Function to update search terms dynamically
  updateSearchTerms(key: string, value: any) {
    this.searchData[key] = value;
    this.searchChanged.emit(this.searchData);  // Emit the updated search data
  }
}
