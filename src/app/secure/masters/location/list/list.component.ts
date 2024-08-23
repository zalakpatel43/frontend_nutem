import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Location } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../location.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './list.component.html',
    providers: [DatePipe]
})
export class LocationListComponent implements OnInit {

    locationData: Location[] = [];
    page: string = ApplicationPage.location;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private locationService: LocationService,
        private notificationService: ToastrService,
        public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.getLocationData();
    }

    private getLocationData() {
        this.loading = true;
        this.locationService.get()
            .subscribe((result: Location[]) => {
                this.locationData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    exportToExcel(): void {
        let exportData: any[] = this.locationData.map(x => {
            return {
                'Id': x.id,
                'Location Code': x.locationCode,
                'Location Name': x.locationName,
                'Company': x.companyName,
                'Address Line 1': x.addressLine1,
                'Address Line 2': x.addressLine2,
                'Address Line 3': x.addressLine3,
                'City': x.city,
                'State': x.stateName,
                'Country': x.countryName,
                'Pincode': x.pincode,
                'Active': x.isActive ? 'Yes' : 'No'
            };
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'Locations.xlsx');
    }

    activateToggleLocation(location: Location, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this location?`);
        if (result) {
            this.locationService.toggleActivate(location.id, isActive)
                .subscribe(() => {
                    this.getLocationData();
                }, () => {
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