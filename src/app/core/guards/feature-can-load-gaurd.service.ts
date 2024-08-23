import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { UserAuthService } from '../service/auth.service';

@Injectable()
export class FeatureCanLoadGuard  {

    constructor(private auth: UserAuthService, private router: Router) {

    }

    canLoad(route: Route): boolean {
        // If the user does not any permission of feature
        if (!this.auth.hasFeaturePermission(route.data.page)) {
            //Redirect to login page
            this.router.navigate(['unauthorized']);
            return false;
        }

        return true;
    }
}