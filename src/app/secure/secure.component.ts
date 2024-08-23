import { Component, HostBinding } from '@angular/core';
import { CommonUtility, UserAuthService } from '@app-core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './secure.component.html',
    styleUrls: ['secure.component.scss']
})

export class SecureComponent {
    @HostBinding('class') componentCssClass : any;
    theme = 'default-theme';
    themeData: any;
    constructor(private activatedRoute: ActivatedRoute, public overlayContainer: OverlayContainer, public userAuthService: UserAuthService) {
        this.getOnlineThemeData();
    }
    private getOnlineThemeData() {

        this.activatedRoute.data.subscribe(({ themeData }) => {
            if (CommonUtility.isNotEmpty(themeData)) {
                this.themeData = themeData;
                this.overlayContainer.getContainerElement().classList.add(this.theme);
                this.componentCssClass = this.themeData.onlineTheme;
                //console.log(this.themeData.onlineTheme);
                this.userAuthService.saveTheme(this.themeData.onlineTheme);
            }

        });

    }
}