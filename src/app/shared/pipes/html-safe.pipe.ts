import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({ name: 'htmlSanitize' })
export class HTMLSanitizePipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {
    }
    transform(html: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }
}