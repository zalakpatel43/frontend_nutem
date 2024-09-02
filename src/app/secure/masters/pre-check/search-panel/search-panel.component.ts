import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pre-check-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class PreCheckSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "preCheckCode, startDateTime, endDateTime"; // Update search keys based on PreCheck model

  updateSearchTerms(key: string, value: any) {
    this.searchData[key] = value;
    this.searchChanged.emit(this.searchData);
  }
}
