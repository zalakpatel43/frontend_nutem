import { OverlayContainer } from '@angular/cdk/overlay';
import { PlatformLocation } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonUtility, UserAuthService } from '@app-core';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'skyward-Admin';

  @HostBinding('class') componentCssClass : any;
  theme: any = 'default-theme';
  constructor(location: PlatformLocation, private router: Router, private activatedRoute: ActivatedRoute,
    private titleService: Title, public overlayContainer: OverlayContainer, public userAuthService: UserAuthService) {
    location.onPopState(() => {
      console.log('Back Button Clicked');
      history.forward();
    });


    this.theme = this.userAuthService.getThemeName();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (CommonUtility.isNotEmpty(this.theme)) {
          this.overlayContainer.getContainerElement().classList.add(this.theme);
          this.componentCssClass = this.theme;
        }
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe((data: any) => {
      if (data) {
        this.titleService.setTitle(data + ' - Skyward');
      }
    });



  }
}
