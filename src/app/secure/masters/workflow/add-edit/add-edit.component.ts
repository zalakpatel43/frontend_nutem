import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Workflow, WorkflowLevel, List } from '@app-models';
import { WorkflowService } from '../workflow.service';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { ModuleGroupService } from '../../module-group/module-group.service';

@Component({
    selector: 'app-workflow-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class WorkflowAddEditComponent implements OnInit, OnDestroy {
    workflowData: Workflow;
    workflowId: number;
    frmWorkflow: UntypedFormGroup;
    routerSub: Subscription;
    isEditMode: boolean = false;
    isFormSubmitted: boolean = false;
    page: string = ApplicationPage.workflow;
    permissions = PermissionType;
    error: string;

    // Dropdown data
    transactions = [];
    approverTypes = [];
    users = [];

    constructor(private fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
        private workflowService: WorkflowService, private listService: ListService, private toastr: ToastrService,
        private moduleGroupService: ModuleGroupService
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.loadDropdowns();
        this.getWorkflowRoute();
    }

    createForm(): void {
        this.frmWorkflow = this.fb.group({
            workflowCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(32)]],
            workflowDate: [new Date(), [Validators.required]],
            transactionId: [null, Validators.required],
            remarks: [''],
            isActive: [true],
            workflowLevels: this.fb.array([])
        });
    }

    getWorkflowRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.workflowId = +params['id'];
                this.getWorkflowDetails(this.workflowId);
            }
            else {
                this.generateWorkflowCode();
            }
        });
    }

    private generateWorkflowCode() {
        this.workflowService.generateWorkflowCode()
            .subscribe((code: string) => {
                this.frmWorkflow.patchValue({ workflowCode: code });
            }, (error) => {
                console.log(error);
            });
    }


    get workflowLevels(): UntypedFormArray {
        return this.frmWorkflow.get('workflowLevels') as UntypedFormArray;
    }

    addWorkflowLevel(level?: WorkflowLevel) {
        this.workflowLevels.push(this.fb.group({
            levelNo: [level ? level.levelNo : this.workflowLevels.length + 1, [Validators.required, Validators.min(1), Validators.max(99)]],
            approverTypeId: [level ? level.approverTypeId : null, Validators.required],
            userIds: [level ? level.userIds : [], Validators.required]
        }));
    }

    removeWorkflowLevel(index: number) {
        this.workflowLevels.removeAt(index);
    }

    loadDropdowns(): void {
        this.moduleGroupService.getModuleGroupList()
            .subscribe((result: List[]) => {
                this.transactions = result;
            });

        this.listService.getList("approvertypes")
            .subscribe((result: List[]) => {
                this.approverTypes = result;
            });

        this.workflowService.getUsers()
            .subscribe((result: List[]) => {
                this.users = result;
            });
    }

    getWorkflowDetails(id: number): void {
        this.workflowService.getById(id).subscribe((data: Workflow) => {
            this.workflowData = data;

            this.workflowData.workflowLevels.forEach(level => {
                level.userIds = level.workflowUsers.map(user => user.userId);
            });

            this.setWorkflowData();
        });
    }

    private setWorkflowData() {
        this.frmWorkflow.patchValue(this.workflowData);
        this.workflowData.workflowLevels.forEach(level => this.addWorkflowLevel(level));
    }

    onApproverTypeChange(event: any, index: number) {
        const approverType = this.approverTypes.find(type => type.id === event.value);
        const usersControl = this.workflowLevels.at(index).get('userIds');
        if (approverType && approverType.name === 'Supervisor Wise') {
            usersControl.setValue([]);
            usersControl.disable();
        } else {
            usersControl.enable();
        }
    }

    isSupervisorWise(level: any): boolean {
        const approverType = this.approverTypes.find(type => type.id === level.get('approverTypeId').value);
        return approverType && approverType.name === 'Supervisor Wise';
    }

    private createWorkflow() {
        let workflow: Workflow = this.frmWorkflow.getRawValue();

        workflow.workflowLevels.forEach((level: WorkflowLevel) => {
            level.workflowUsers = [];

            level.userIds.forEach((userId: number) => {
                level.workflowUsers.push({ userId: userId, });
            });
        });

        let isDuplicateLevel = false;
        let levelNo: number;

        for (let i = 0; i < workflow.workflowLevels.length; i++) {
            for (let j = i + 1; j < workflow.workflowLevels.length; j++) {
                if (workflow.workflowLevels[i].levelNo === workflow.workflowLevels[j].levelNo) {
                    isDuplicateLevel = true;
                    levelNo = workflow.workflowLevels[i].levelNo;
                    break;
                }
            }
        }

        if (isDuplicateLevel) {
            this.toastr.warning(`Level# ${levelNo} specified more than once.`);
            return;
        }

        this.workflowService.add(workflow)
            .subscribe(() => {
                this.cancel();
                this.toastr.success("Workflow added successfully.");
            },
                (error) => {
                    this.error = error;
                    this.toastr.warning("Something went wrong. Please try again.");
                });
    }

    private updateWorkflow() {
        let workflow: Workflow = this.frmWorkflow.getRawValue();
        this.workflowData = Object.assign(this.workflowData, this.workflowData, workflow);

        workflow.workflowLevels.forEach((level: WorkflowLevel) => {
            level.workflowUsers = [];

            level.userIds.forEach((userId: number) => {
                level.workflowUsers.push({ userId: userId, });
            });
        });

        let isDuplicateLevel = false;
        let levelNo: number;

        for (let i = 0; i < workflow.workflowLevels.length; i++) {
            for (let j = i + 1; j < workflow.workflowLevels.length; j++) {
                if (workflow.workflowLevels[i].levelNo === workflow.workflowLevels[j].levelNo) {
                    isDuplicateLevel = true;
                    levelNo = workflow.workflowLevels[i].levelNo;
                    break;
                }
            }
        }

        if (isDuplicateLevel) {
            this.toastr.warning(`Level# ${levelNo} specified more than once.`);
            return;
        }

        this.workflowService.update(this.workflowData.id, this.workflowData)
            .subscribe(() => {
                this.cancel();
                this.toastr.success("Workflow updated successfully.");
            },
                (error) => {
                    this.error = error;
                    this.toastr.warning("Something went wrong. Please try again.");
                });
    }

    setValidators() {
        this.workflowLevels.controls.forEach((level, index) => {
            const approverType = this.approverTypes.find(type => type.id === level.get('approverTypeId').value);
            const userIds = level.get('userIds');

            if (userIds && approverType && approverType.name === 'Supervisor Wise') {
                userIds.setValue([]);
                userIds.disable();
            } else {
                userIds.enable();
            }
        });
    }

    save() {
        this.isFormSubmitted = true;

        this.setValidators();

        if (this.frmWorkflow.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateWorkflow();
        } else {
            this.createWorkflow();
        }
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }
}