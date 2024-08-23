import { Component, OnInit } from '@angular/core';
import { ApplicationPage, PermissionType } from '@app-core';
import { Workflow } from '@app-models';
import { ToastrService } from 'ngx-toastr';
import { WorkflowService } from '../workflow.service';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './list.component.html'
})
export class WorkflowListComponent implements OnInit {

    workflowData: Workflow[] = [];
    page: string = ApplicationPage.workflow;
    permissions = PermissionType;
    isActive: boolean;
    error: string;
    loading: boolean;

    searchData: { [key: string]: any } = {
        isActive: false
    };

    constructor(private workflowService: WorkflowService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getWorkflowData();
    }

    private getWorkflowData() {
        this.loading = true;

        this.workflowService.get()
            .subscribe((result: Workflow[]) => {
                this.workflowData = result;
                this.loading = false;
            }, (error) => {
                console.log(error);
                this.loading = false;
            });
    }

    activateToggleWorkflow(workflow: Workflow, isActive: boolean) {
        const result = confirm(`Are you sure you want to ${isActive ? `Activate` : `Deactivate`} this workflow?`);
        if (result) {
            this.workflowService.toggleActivate(workflow.id, isActive)
                .subscribe(() => {
                    this.getWorkflowData();
                }, (error) => {
                    this.toastr.error("Something went wrong.");
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