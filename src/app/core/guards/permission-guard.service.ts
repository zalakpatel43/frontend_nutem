import { Injectable } from '@angular/core';
import { PermissionService } from '../service/permission.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {

constructor(private permissionService: PermissionService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const requiredPermission = route.data['permission'];
     // console.log("permission", requiredPermission)
      if (this.permissionService.hasPermission(requiredPermission)) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }
}
