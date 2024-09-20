import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserAuthService } from '../service/auth.service';
import { PermissionService } from '../service/permission.service';

@Injectable()
export class PageAuthGuard  {

    constructor(private auth: UserAuthService, private router: Router) {

    }

   

   canActivate(route: ActivatedRouteSnapshot): boolean {
      //  If the user does not any permission of feature
        // if (!this.auth.hasPagePermission(route.data.page, route.data.action)) {
        //     //Redirect to login page
        //     this.router.navigate(['unauthorized']);
        //     return false;
        // }

        return true;
    }
}