import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QualityParameter, QualityParameterDetail, QualityParameterDocument, List, FileConfiguration } from '@app-models';
import { QualityParameterService } from '../quality-parameter.service';
import { ApplicationPage, CommonUtility, FileUploaderService, ListService, PermissionType } from '@app-core';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilePreviewModalComponent } from 'src/app/shared/components/file-preview-modal/file-preview-modal.component';
import { UploadType } from '@app-enums';

@Component({
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class QualityParameterAddEditComponent implements OnInit, OnDestroy {
    qualityParameterData: QualityParameter;
    qualityParameterId: number;
    qualityParameterForm: UntypedFormGroup;
    routerSub: Subscription;
    isEditMode: boolean = false;
    isFormSubmitted: boolean = false;
    page: string = ApplicationPage.qualityParameter;
    permissions = PermissionType;
    error: string;

    fileUploader: FileUploaderService;
    uploadDocuments: QualityParameterDocument[] = [];
    uploadedCount: number = 0;

    filePreviewModalRef: BsModalRef;

    // Dropdown data
    products = [];
    approvalStatuses = [];
    parameters = [];
    classes = [];
    lslDimensions = [];
    uslDimensions = [];
    measuringInstruments = [];
    sampleFrequencies = [];
    reportingFrequencies = [];

    constructor(private fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
                private qualityParameterService: QualityParameterService, private listService: ListService,
                private toastr: ToastrService, private modalService: BsModalService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.loadDropdowns();
        this.getQualityParameterRoute();
    }

    createForm(): void {
        this.qualityParameterForm = this.fb.group({
            qualityParameterCode: [{ value: '', disabled: true }, [Validators.required]],
            revisionNo: [{ value: 'R00', disabled: true }],
            drawingNumber: ['', [Validators.required]],
            productId: [null, Validators.required],
            approvalStatusId: [null, Validators.required],
            isActive: [true],
            qcQuantity : [0, Validators.required],
            qcParameterDetails: this.fb.array([]),
            qcParameterDocuments: this.fb.array([])
        });
    }

    getQualityParameterRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.qualityParameterId = +params['id'];
                this.getQualityParameterDetails(this.qualityParameterId);
            } else {
                this.generateQualityParameterCode();
            }
        });
    }

    get qcParameterDetails(): UntypedFormArray {
        return this.qualityParameterForm.get('qcParameterDetails') as UntypedFormArray;
    }

    get qcParameterDocuments(): UntypedFormArray {
        return this.qualityParameterForm.get('qcParameterDocuments') as UntypedFormArray;
    }

    addQualityParameterDetail(detail?: QualityParameterDetail) {
        this.qcParameterDetails.push(this.fb.group({
            parameterId: [detail ? detail.parameterId : null, Validators.required],
            classId: [detail ? detail.classId : null, Validators.required],
            lslDimensionId: [detail ? detail.lslDimensionId : null, Validators.required],
            uslDimensionId: [detail ? detail.uslDimensionId : null, Validators.required],
            measuringInstrumentId: [detail ? detail.measuringInstrumentId : null, Validators.required],
            sampleFrequencyId: [detail ? detail.sampleFrequencyId : null, Validators.required],
            reportingFrequencyId: [detail ? detail.reportingFrequencyId : null, Validators.required],
            dimension: [detail ? detail.dimension : null],
            tolerance: [detail ? detail.tolerance : '']
        }));
    }

    addQualityParameterDocument(document?: QualityParameterDocument) {
        let exists: boolean = true;

        if (!document) {
            exists = false;

            document = new QualityParameterDocument();
            document.pictureId = null;
            document.picture = null;
            document.documentName = '';
            document.hideUploader = false;
            document.uniqueId = CommonUtility.generateUUID();
            document.uploader = new FileUploaderService({
                maxAllowedFile: 1,
                completeCallback: this.uploadCompleted.bind(this, document),
                onWhenAddingFileFailed: this.uploadFailed.bind(this)
            });
        }

        this.qcParameterDocuments.push(this.fb.group({
            documentName: [document ? document.documentName : '', [Validators.required, Validators.maxLength(256)]],
            pictureId: [document ? document.pictureId : null],
            uniqueId: [document ? document.uniqueId : null]
        }));

        if (CommonUtility.isEmpty(this.qualityParameterData)) {
            this.qualityParameterData = new QualityParameter();
        }

        if (!exists) {
            this.qualityParameterData.qcParameterDocuments.push(document);
        }
    }

    removeQualityParameterDetail(index: number) {
        this.qcParameterDetails.removeAt(index);
    }

    removeQualityParameterDocument(index: number) {
        this.qcParameterDocuments.removeAt(index);
        this.qualityParameterData.qcParameterDocuments.splice(index, 1);
    }

    private generateQualityParameterCode() {
        this.qualityParameterService.generateCode()
            .subscribe((code: string) => {
                this.qualityParameterForm.patchValue({ qualityParameterCode: code });
            }, (error) => {
                console.log(error);
            });
    }

    loadDropdowns(): void {
        this.listService.getList("rawmaterialProducts")
            .subscribe((result: List[]) => {
                this.products = result;
            });

        this.listService.getList("approvalStatuses")
            .subscribe((result: List[]) => {
                this.approvalStatuses = result;
            });

        this.listService.getList("qcparameters")
            .subscribe((result: List[]) => {
                this.parameters = result;
            });

        this.listService.getList("qcclasses")
            .subscribe((result: List[]) => {
                this.classes = result;
            });

        this.listService.getList("lslDimensions")
            .subscribe((result: List[]) => {
                this.lslDimensions = result;
            });

        this.listService.getList("uslDimensions")
            .subscribe((result: List[]) => {
                this.uslDimensions = result;
            });

        this.listService.getList("measuringInstruments")
            .subscribe((result: List[]) => {
                this.measuringInstruments = result;
            });

        this.listService.getList("sampleFrequencies")
            .subscribe((result: List[]) => {
                this.sampleFrequencies = result;
            });

        this.listService.getList("reportingFrequencies")
            .subscribe((result: List[]) => {
                this.reportingFrequencies = result;
            });
    }

    getQualityParameterDetails(id: number): void {
        this.qualityParameterService.getById(id).subscribe((data: QualityParameter) => {
            this.qualityParameterData = data;

            if (CommonUtility.isNotEmpty(this.qualityParameterData.qcParameterDocuments)) {
                this.qualityParameterData.qcParameterDocuments.forEach((document) => {
                    document.hideUploader = document.pictureId > 0;
                    document.uniqueId = CommonUtility.generateUUID();
                    document.uploader = new FileUploaderService({
                        maxAllowedFile: 1,
                        completeCallback: this.uploadCompleted.bind(this, document),
                        onWhenAddingFileFailed: this.uploadFailed.bind(this)
                    });
                });
            }

            this.setQualityParameterData();
            this.updateRevisionNo();
        });
    }

    private setQualityParameterData() {
        this.qualityParameterForm.patchValue(this.qualityParameterData);
        this.qualityParameterData.qcParameterDetails.forEach(detail => this.addQualityParameterDetail(detail));
        this.qualityParameterData.qcParameterDocuments.forEach((document) => this.addQualityParameterDocument(document));
    }

    private createQualityParameter() {
        let qualityParameter: QualityParameter = this.qualityParameterForm.getRawValue();
        this.qualityParameterData = Object.assign(this.qualityParameterData, this.qualityParameterData, qualityParameter);

        this.qualityParameterService.add(qualityParameter)
            .subscribe(() => {
                this.cancel();
                this.toastr.success("Quality Parameter details added successfully.");
            },
                (error) => {
                    this.error = error;
                });
    }

    private updateQualityParameter() {
        let qualityParameter: QualityParameter = this.qualityParameterForm.getRawValue();
        this.qualityParameterData = Object.assign(this.qualityParameterData, this.qualityParameterData, qualityParameter);

        this.qualityParameterService.update(this.qualityParameterData.id, this.qualityParameterData)
            .subscribe(() => {
                this.cancel();
                this.toastr.success("Quality Parameter details updated successfully.");
                this.updateRevisionNo();

            },
                (error) => {
                    this.error = error;
                });
    }

    save() {
        this.isFormSubmitted = true;

        if (this.qualityParameterForm.invalid) {
            return;
        }

        if (this.qualityParameterData.qcParameterDocuments.some(d => !d.pictureId && !d.uploader.hasFile())) {
            this.toastr.warning("Please upload all the required documents.");
            return;
        }

        this.uploadDocuments = this.qualityParameterData.qcParameterDocuments.filter(d => d.uploader.hasFile());
        this.uploadedCount = 0;

        if (this.uploadDocuments.length > 0) {
            this.uploadDocuments.forEach((document, index) => {
                if (document.uploader.hasFile()) {
                    document.uploader.uploadFiles({
                        uploadType: UploadType.QualityParameter,
                        id: `0`
                    });
                }
            });
        }
        else {
            if (this.isEditMode) {
                this.updateQualityParameter();
            } else {
                this.createQualityParameter();
            }
        }
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    hasFile(item: QualityParameterDocument) {
        return ((this.isEditMode && CommonUtility.isNotEmpty(item.picture)) || item.uploader.hasFile());
    }

    private uploadCompleted(item: any, response: any) {
        this.uploadedCount++;

        const docControl = this.qcParameterDocuments.controls.find(c => c.get('uniqueId').value === item.uniqueId);
        if (docControl) {
            docControl.get('pictureId').setValue(response.id);
        }

        if (this.uploadedCount === this.uploadDocuments.length) {
            if (this.isEditMode) {
                this.updateQualityParameter();
            } else {
                this.createQualityParameter();
            }
        }
    }

    private uploadFailed() {
        this.toastr.warning("You are only allowed to upload jpg/jpeg/png/pdf/doc files.");
    }

    selectedFile(item: QualityParameterDocument) {
        item.hideUploader = true;
    }

    removeEditFile(item: QualityParameterDocument) {
        item.pictureId = null;
        item.picture = null;
        item.hideUploader = false;
        item.uploader.uploader.clearQueue();
    }

    filePreview(file, type, title) {
        this.filePreviewModalRef = this.modalService.show(FilePreviewModalComponent, { class: 'modal-lg modal-tr' });
        this.filePreviewModalRef.content.setData({ file, type, title });
    }

    private updateRevisionNo() {
        let currentRevision = this.qualityParameterForm.get('revisionNo').value;
        let revisionNumber = parseInt(currentRevision.replace('R', ''), 10) + 1;
        let newRevisionNo = `R${revisionNumber.toString().padStart(2, '0')}`;
        this.qualityParameterForm.get('revisionNo').setValue(newRevisionNo);
    }


    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }
}
