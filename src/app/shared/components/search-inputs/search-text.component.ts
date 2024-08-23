import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'search-text',
    template: `<mat-form-field >
                <mat-label>{{placeHolder}}</mat-label>
                <input matInput placeholder="Search"  [formControl]="searchBox">
            </mat-form-field>`,
    styles: []
})
export class SearchTextComponent implements OnInit {
    searchBox: UntypedFormControl = new UntypedFormControl();

    @Input() placeHolder = "Search";
    @Output() textSearchEntered = new EventEmitter();

    ngOnInit() {
        this.searchBox.valueChanges.pipe(debounceTime(300))
            .subscribe(value => this.textSearchEntered.emit(value));
    }
}