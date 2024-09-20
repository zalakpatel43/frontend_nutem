import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: string[] = [];

  constructor() { 
    this.setPermissions();
  }

  // Set permissions, typically called after fetching from an API
  setPermissions(): void {

    this.permissions =  JSON.parse(localStorage.getItem('userPermissions')); 
   // this.permissions =  permissions;
   // console.log("permission from service", this.permissions);
  }

  // Check if user has the required permission
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}
