import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'production-order-search-panel',
  templateUrl: './search-panel.component.html',
})
export class ProductionOrderSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  
  // Update search keys based on ProductionOrder model
  searchKey = "code, poNumber, poDate"; 

  updateSearchTerms(key: string, value: any) {
    this.searchData[key] = value;
    this.searchChanged.emit(this.searchData);
  }
}
