import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'post-check-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class PostCheckSearchPanelComponent {
  @Output() searchChanged = new EventEmitter();
  searchData: { [key: string]: any } = {};
  searchKey = "postCheckCode, startDateTime, endDateTime"; // Update search keys based on PostCheck model

  updateSearchTerms(key: string, value: any) {
    this.searchData[key] = value;
    this.searchChanged.emit(this.searchData);
  }
}
