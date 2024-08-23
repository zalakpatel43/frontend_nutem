import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Company } from '@app-models'; // Ensure you have Company model
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../company.service'; // Ensure you have a CompanyService

@Component({
    templateUrl: './list.component.html' // Update template URL if necessary
})
export class CompanyListComponent implements OnInit {

    companyData: Company[] = []; // Change User to Company
    page: string = ApplicationPage.company; // Change .user to .company
    permissions = PermissionType;
    loading: boolean;
    isActive: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    }

    constructor(private companyService: CompanyService, private notificationService: ToastrService) {
        // Inject the CompanyService instead of UserService
    }

    ngOnInit(): void {
        this.getCompanyData(); // Change method name to reflect companies
    }

    private getCompanyData() {
        this.loading = true;

        this.companyService.get() // Use the companyService here
            .subscribe((result: Company[]) => { // Expect Company array
                this.loading = false;
                this.companyData = result; // Store the result in companyData
            }, (error) => {
                this.loading = false;
                console.log(error);
            });
    }

    // ... Any other relevant methods that should be adapted for companies ...

    toggleActivate(companyId: number, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this company?`);
        if (result) {
            this.companyService.toggleActivate(companyId, isActive) // Use companyService.toggleActivate
                .subscribe((result) => {
                    if (result.isSuccess) {
                        this.getCompanyData(); // Refresh company data
                    }
                    else {
                        this.notificationService.warning(result.message);
                    }
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
