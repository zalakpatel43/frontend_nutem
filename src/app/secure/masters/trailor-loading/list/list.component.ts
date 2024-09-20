import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { TrailerLoadingService } from '../trailor-loading.service';
import { ToastrService } from 'ngx-toastr';
import { TrailerLoading } from 'src/app/model/trailor-loading';
import { PermissionService } from 'src/app/core/service/permission.service';


@Component({
    selector: 'app-trailer-loading-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class TrailerLoadingListComponent implements OnInit {

    trailerLoadingData: TrailerLoading[] = [];
    page: string = ApplicationPage.trailerLoading;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {};
    showDeleteModal: boolean = false;

    IsAddPemission:boolean = false;
    IsEditPermission: boolean = false;
    IsDeletePermission: boolean = false;

    constructor(private trailerLoadingService: TrailerLoadingService,
                private notificationService: ToastrService,
                private permissionService: PermissionService) { }

    ngOnInit(): void {
        this.IsAddPemission = this.permissionService.hasPermission('Trailer Loading (PER_TRAILERLOADING) - Add');
        this.IsEditPermission = this.permissionService.hasPermission('Trailer Loading (PER_TRAILERLOADING) - Edit');
        this.IsDeletePermission = this.permissionService.hasPermission('Trailer Loading (PER_TRAILERLOADING) - Delete');
        this.getTrailerLoadingData();
    }

    private getTrailerLoadingData() {
        this.loading = true;

        this.trailerLoadingService.getTrailerLoadingList()
            .subscribe((result: any) => {
                this.trailerLoadingData = result;
                console.log("Trailer loading list", result);
                this.loading = false;
            },
            (error) => {
                this.error = error;
                this.loading = false;
            });
    }

    removeTrailerLoading(id: number) {
        const result = confirm(`Are you sure, you want to delete this trailer loading record?`);
        if (result) {
            this.trailerLoadingService.deleteTrailerLoading(id)
                .subscribe(() => {
                    this.getTrailerLoadingData();
                }, () => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
        console.log("search data", this.searchData);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }
}
