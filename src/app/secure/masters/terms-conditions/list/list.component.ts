import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { TermsAndConditions } from '@app-models';  // Adjust the import path as necessary
import { ToastrService } from 'ngx-toastr';
import { TermsAndConditionsService } from '../terms-conditions.service';

@Component({
    templateUrl: './list.component.html'
})

export class TermsAndConditionsListComponent implements OnInit {

    termsAndConditionsData: TermsAndConditions[] = [];
    page: string = ApplicationPage.termsAndConditions;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private termsAndConditionsService: TermsAndConditionsService, private notificationService: ToastrService) { }

    ngOnInit(): void {
        this.getTermsAndConditionsData();
    }

    private getTermsAndConditionsData() {
        this.loading = true;

        this.termsAndConditionsService.get()
            .subscribe((result: TermsAndConditions[]) => {
                this.termsAndConditionsData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleTermsAndConditions(termsAndConditions: TermsAndConditions, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `activate` : `deactivate`} this item?`);
        if (result) {
            this.termsAndConditionsService.toggleActivate(termsAndConditions.id, isActive)
                .subscribe(() => {
                    this.getTermsAndConditionsData();
                }, (error) => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }
}