import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { DocumentDetails } from "@app-models";
import { APIConstant, CommonUtility } from "@app-core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FilePreviewModalComponent } from "../file-preview-modal/file-preview-modal.component";

@Component({
  selector: "file-uploader",
  templateUrl: "./file-uploader.component.html",
  styles: [
    `
      label {
        padding-top: 10px;
      }
      .upload-btn-wrapper {
        position: relative;
        /* overflow: hidden */;
        display: inline-block;
      }

      .upload-btn-wrapper input[type="file"] {
        font-size: 100px;
        position: absolute;
        top: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
      .upload-btn-wrapper input[type="file"]:hover {
        color: #ffffff !important;
        background-color: #0a317a;
        border: 3px solid #0a317a;
      }
      .list-group{
        margin-bottom: 1em;
      }

      .file-list .row {
        margin : 0;
      }

      .file-list .col-sm-12{
        padding: 0;
      }

      .file-list .col-sm-12{
        padding: 0;
      }

      .file-list ul{
        margin-bottom: 0;
      }

      .file-list li{
        background: transparent;
        border: none;
        margin: 0;
        padding: 0;
      }
    `
  ]
})
export class FileUploaderComponent {
  @Input()
  uploadType: ("modal" | "page") = "page";

  @Input()
  documents: DocumentDetails;
  @Input()
  isEditMode: boolean;
  @Input()
  uploader: FileUploader;
  @Input()
  label: string;
  @Input()
  hideUploader: boolean;
  @Output()
  removeDocument = new EventEmitter<any>();
  @Output()
  selectedFile = new EventEmitter();
  basePath: string = APIConstant.basePath;
  filePreviewModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {

  }

  remove(index?: number) {
    this.removeDocument.emit(index);
    this.hideUploader = false;
  }

  fileSelected(event) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile.emit(event);
      event.srcElement.value = "";
      this.hideUploader = true;
    }
  }

  filePreview(file, type, title) {
    this.filePreviewModalRef = this.modalService.show(FilePreviewModalComponent, { class: 'modal-lg modal-tr' });
    this.filePreviewModalRef.content.setData({ file, type, title });
  }
}