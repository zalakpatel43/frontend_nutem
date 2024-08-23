import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ValidationService } from './validation-service';
import { matFormFieldAnimations } from '@angular/material/form-field'; // Updated import

@Component({
    selector: 'mat-validation-message',
    template: `
    <div class="mat-form-field-subscript-wrapper" *ngIf="errorMessage !== null" style="margin-top: 2.2em;">
        <div [@transitionMessages]="errorMessage !== null ? 'enter' : ''">
            <mat-error class="mat-error" role="alert">{{errorMessage}}</mat-error>
        </div>
    </div>
    `,
    styles: [`
        .mat-error {
            font-size: 11px;
        }
    `],
    animations: [matFormFieldAnimations.transitionMessages] // Updated usage
})
export class MatValidationMessage {

    @Input("control")
    control: AbstractControl;

    @Input("message")
    message: string = "";

    @Input("formSubmitted")
    formSubmitted: boolean = false;

    constructor() { }

    get errorMessage() {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.formSubmitted)) {
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName], this.message);
            }
        }
        return null;
    }
}
