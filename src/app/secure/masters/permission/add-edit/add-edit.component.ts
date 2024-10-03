import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { RoleService } from '../services/role.service';
import { PermissionService } from '../permission.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class PermissioonAddEditComponent implements OnInit {
  permissionForm: FormGroup;
  roles: any[] = []; // Replace with actual type
  permissions: any[] = []; // Replace with actual type
  isEditMode: boolean;
  permissionId: number | null = null;
page: any;
  activatedRoute: ActivatedRoute;

  constructor(
    private formBuilder: FormBuilder,
    // private roleService: RoleService,
    // private permissionService: PermissionService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.permissionForm = this.formBuilder.group({
      roleId: ['', Validators.required],
      permissionId: ['', Validators.required],
      view: [false],
      add: [false],
      edit: [false],
      delete: [false]
    });
  }

  ngOnInit(): void {
    // Load roles and permissions here
    // this.loadRoles();
    // this.loadPermissions();

    // Example: Check if in edit mode based on route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.permissionId = +params['id'];
        // Load permission details here based on this.permissionId if needed
      }
    });
  }

//   loadRoles(): void {
//     this.roleService.getRoles().subscribe(
//       (roles: any[]) => {
//         this.roles = roles; // Adjust according to actual API response
//       },
//       error => {
//         console.error('Failed to load roles:', error);
//       }
//     );
//   }

//   loadPermissions(): void {
//     this.permissionService.getPermissions().subscribe(
//       (permissions: any[]) => {
//         this.permissions = permissions; // Adjust according to actual API response
//       },
//       error => {
//         console.error('Failed to load permissions:', error);
//       }
//     );
//   }

  save(): void {
    if (this.permissionForm.invalid) {
      return;
    }

    const formData = this.permissionForm.value;
    // Example: Submit formData to backend or perform necessary actions
   // console.log(formData);

    // Example: Redirect to permission list after save
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancel() {
    if (this.isEditMode) {
      this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
    }
  }
}
