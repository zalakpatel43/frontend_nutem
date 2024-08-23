

import { Injectable } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ConfirmationBoxComponent } from "./confirmation-box.component";
import { BaseService, APIConstant } from "@app-core";

@Injectable()
export class ConfirmationBoxService {

    confirmationModalRef: BsModalRef;

    constructor(private modalService: BsModalService, private _baseService: BaseService) {

    }

    show(data: { message: string, yesBtnText?: string, noBtnText?: string }, yesCallback: Function, noCallback?: Function) {
        const initialState = {
            message: data.message,
            yesBtnText: data.yesBtnText || 'Yes',
            noBtnText: data.noBtnText || 'No'
        }
        this.confirmationModalRef = this.modalService.show(ConfirmationBoxComponent, {
            backdrop: true,
            ignoreBackdropClick: true,
            keyboard:false,
            initialState
        });
        this.confirmationModalRef.content.onClose.subscribe((result: any) => {
            this.confirmationModalRef.content.onClose.unsubscribe();
            if (result) {
                yesCallback();
            } else if (noCallback) {
                noCallback();
            }
        });
    }

  
}