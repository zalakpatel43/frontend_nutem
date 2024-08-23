import { Component, Input } from '@angular/core';
import { BadRequestError } from '@app-models';

@Component({
    selector: 'form-server-error',
    templateUrl: './form-server-error.component.html'
})
export class FormServerErrorComponent {

    @Input()
    error: BadRequestError;

    constructor() { }

}

