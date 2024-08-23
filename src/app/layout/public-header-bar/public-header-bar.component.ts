import { Component, OnInit } from '@angular/core';
import { UserAuthService, CommonUtility, APIConstant } from '@app-core';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/public/public.service';

@Component({
    selector: 'public-header-bar',
    templateUrl: './public-header-bar.component.html',
    styleUrls: ['public-header-bar.component.scss']
})

export class PublicHeaderBarComponent implements OnInit {

    userLoggedIn: boolean = false;
    public href: string = "";
    isHome: boolean = true;
    isContact: boolean = true;
    isTerms: boolean = true;
    isPolicy: boolean = true;
    isFaq: boolean = true;
    imagePath: string = 'assets/images/logo.png';
    basePath: string = APIConstant.basePath;
    locationImage: string = '';

    constructor(private userAuthService: UserAuthService, private router: Router,
        private publicService: PublicService) {
    }

    ngOnInit() {
        this.href = this.router.url;
        const user: any = this.userAuthService.getUser();
        
    }

  
}