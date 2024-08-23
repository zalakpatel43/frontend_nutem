import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { QualityParameter } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { QualityParameterService } from '../quality-parameter.service';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './list.component.html',
    providers: [DatePipe]
})
export class QualityParameterListComponent implements OnInit {

    qualityParameterData: QualityParameter[] = [];
    page: string = ApplicationPage.qualityParameter;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private qualityParameterService: QualityParameterService, 
                private notificationService: ToastrService,
                public datePipe: DatePipe) {}

    ngOnInit(): void {
        this.getQualityParameterData();
    }

    private getQualityParameterData() {
        this.loading = true;
        this.qualityParameterService.get()
            .subscribe((result: QualityParameter[]) => {
                this.qualityParameterData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleQualityParameter(qualityParameter: QualityParameter, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this quality parameter?`);
        if (result) {
            this.qualityParameterService.toggleActivate(qualityParameter.id, isActive)
                .subscribe(() => {
                    this.getQualityParameterData();
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
