import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { WeightCheckService } from '../weight-check.service';
import { ToastrService } from 'ngx-toastr';
import { WeightCheck } from 'src/app/model/WeightCheck';

@Component({
    selector: 'app-list',
    // standalone: false,
    // imports: [],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class WeightCheckListComponent implements OnInit {

    weightCheckData: WeightCheck[] = [];
    page: string = ApplicationPage.weightCheck;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
       // isActive: false
    };
    showDeleteModal : boolean = false;

    constructor(private weightCheckService: WeightCheckService,
        private notificationService: ToastrService) { }

    ngOnInit(): void {
        this.getWeightCheckData();
    }

    private getWeightCheckData() {
        this.loading = true;

        this.weightCheckService.getWeightCheckList()
            .subscribe((result: any) => {
                // this.cancel();
                this.weightCheckData = result;
                console.log("Weight checl list", this.weightCheckData);
                this.loading = false;
            },
                (error) => {
                    this.error = error;
                    this.loading = false;
                });
    }

    removeWeightCheck(id:number) {
        const result = confirm(`Are you sure, you want to delete this Weight Check?`);
        if (result) {
            this.weightCheckService.DeleteWeightCheck(id)
                .subscribe(() => {
                    this.getWeightCheckData();
                }, () => {
                    this.notificationService.error("Something went wrong.");
                });
        }
    }

    updateSearch(search: { [key: string]: any }) {
        this.searchData = Object.assign({}, search);
        console.log("serach data", this.searchData);
    }

    isActiveRow(row) {
        return {
            'text-danger': !row.isActive
        };
    }

    // removeWeightCheck(id:number){
    //     console.log("id for delete", id)
    //     this.showDeleteModal = true;
    // }

   
}
