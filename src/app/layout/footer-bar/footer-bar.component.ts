import { Component } from '@angular/core';
import { PublicService } from 'src/app/public/public.service';

@Component({
    selector: 'footer-bar',
    templateUrl: './footer-bar.component.html',
    styleUrls: ['footer-bar.component.scss']
})
export class FooterBarComponent {
    isHome: boolean = true;
    isContact: boolean = true;
    isTerms: boolean = true;
    isPolicy: boolean = true;
    isFaq: boolean = true;

    constructor(private publicService: PublicService) {

    }
}