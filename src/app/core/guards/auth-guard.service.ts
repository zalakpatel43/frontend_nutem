import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard  {

    constructor(private auth: UserAuthService, private router: Router) { }

    canActivate(): boolean {
        // If the user is not logged in we'll send them back to the home page

        if (!this.auth.isLoggedIn()) {
            //Redirect to login page
            this.router.navigate(['unauthorized']);
        }
        return true;
    }

}