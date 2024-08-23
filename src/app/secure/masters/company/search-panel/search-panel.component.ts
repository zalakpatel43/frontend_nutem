import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { SearchInActiveComponent } from '@app-shared';

@Component({
    selector: 'company-search-panel',
    templateUrl: './search-panel.component.html'
})

export class CompanySearchPanelComponent {
    @ViewChild(SearchInActiveComponent) searchInactive: SearchInActiveComponent;

    @Output()
    searchChanged = new EventEmitter();

    searchData: { [key: string]: any } = [];
    searchKey = "companyName,alias,address1,pincode,city,state,country,emailID,phoneNo";

    updateSearchTerms(key: string, value) {
        const isActive: boolean = this.searchInactive.searchBox.value;
        this.searchData['isActive'] = isActive;

        this.searchData[key] = value;
        this.searchChanged.emit(this.searchData);
    }
}
