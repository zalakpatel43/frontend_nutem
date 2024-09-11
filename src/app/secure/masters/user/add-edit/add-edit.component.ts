import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from 'node_modules/@angular/router';
import { ToastrService } from 'ngx-toastr';
import { List, User } from '@app-models';
import { ApplicationPage, CommonUtility, ListService, PermissionType } from '@app-core';
import { ValidationService } from '@app-shared';
import { UserService } from '../user.service';
import { RoleService } from '../../role/role.service';

@Component({
    templateUrl: './add-edit.component.html'
})

export class UserAddEditComponent implements OnInit, OnDestroy {

    userData: User;
    userId: any;
    isEditMode: boolean;
    frmUser: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    reportsToData: User[] = [];
    roleData: List[] = [];
    hidePassword = true;
    hideConfirmPassword = true;
    error: string;
    page: string = ApplicationPage.user;
    permissions = PermissionType;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private formBuilder: UntypedFormBuilder, private userService: UserService,private roleService: RoleService,
        private notificationService: ToastrService, private listService: ListService) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getUserRoute();
        this.getRoleData();
    }

    private getUserRoute() {
        this.routerSub = this.activatedRoute.params.subscribe((params) => {
            console.log("Edit params ", params)
            this.isEditMode = !CommonUtility.isEmpty(params["id"]);
            this.createForm();
            if (this.isEditMode) {
                this.userId = params.id //+params["id"];
                this.getUserDetails();
            }
            else {
                this.userData = new User();
                this.getRoleData();
            }
        });
    }

    private getUserDetails() {
        console.log("user id ", this.userId)
        this.userService.getById(this.userId)
            .subscribe((result: User) => {
                this.userData = result;
                this.setUserData();
                this.getRoleData();

            }, (error) => {
                console.log(error);
            });
    }

   

    private getRoleData() {
        // this.listService.getList("activeroles")
        //     .subscribe((result: List[]) => {
        //         this.roleData = result;
        //         this.createRolesControl();
        //     })

        this.roleService.getRole()
        .subscribe((result: any) => {
            this.roleData = result;
            this.createRolesControl();
        }, (error) => {
            console.log(error);

        });
    }

    getReportsToData() {
        
        const userId: number = CommonUtility.isNotNull(this.userId) ? this.userId : 0;
         this.userService.get()
                .subscribe((result: User[]) => {
                    this.reportsToData = result;
                    this.createReportsToControl();
                });
    }

   

    private setUserData() {
        this.frmUser.patchValue(this.userData);
        this.frmUser.controls.password.setValue('********');
        this.frmUser.controls.confirmPassword.setValue('********');
    }

    createForm() {
        this.frmUser = this.formBuilder.group({
            userName: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.maxLength(50)]],
            password: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.min(6), Validators.maxLength(20), ValidationService.passwordValidator]],
            confirmPassword: [{ value: '', disabled: this.isEditMode }, [Validators.required, ValidationService.comparePassword]],
           // firstName: ['', [Validators.required, Validators.maxLength(50)]],
           // lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, ValidationService.emailValidator, ValidationService.multipleemailrestrictValidator, Validators.maxLength(50)]],
            phoneNumber: ['', [Validators.maxLength(15)]],
           // reportsTo: new UntypedFormArray([], ValidationService.minSelectedCheckboxes(0)),
           // roles: new UntypedFormArray([], ValidationService.minSelectedCheckboxes(1)),
        });
    }

    private createReportsToControl() {
        const reportsToArray = <UntypedFormArray>this.frmUser.controls['reportsTo'];
        reportsToArray.controls = [];
        this.reportsToData.forEach(item => {
            reportsToArray.push(new UntypedFormControl((this.userData.reportsTo || []).some(x => x.reportToId === item.id)));
        });
    }

    private createRolesControl() {
        // const rolesArray = <UntypedFormArray>this.frmUser.controls['roles'];
        // rolesArray.controls = [];
        // this.roleData.forEach(item => {
        //     rolesArray.push(new UntypedFormControl((this.userData.roles || []).some(x => x.roleId === item.id)));
        // });
    }

    private createUser() {
        // let reportsTo: Array<{ reportToId: number }> = []
        // const reportsToList = CommonUtility.getSelectedCheckboxList(this.frmUser.value.reportsTo, this.reportsToData);
        // if (CommonUtility.isNotEmpty(reportsToList)) {
        //     reportsToList.forEach((item: List) => {
        //         reportsTo.push({ reportToId: item.id });
        //     });
        // }

        // let roles: Array<{ id: number }> = [];
        // const rolesList = CommonUtility.getSelectedCheckboxList(this.frmUser.value.roles, this.roleData);
        // if (CommonUtility.isNotEmpty(r   olesList)) {
        //     rolesList.forEach((item: List) => {
        //         roles.push({ id: item.id });
        //     });
        // }

        let user: User = Object.assign({}, this.frmUser.value
        //     , {
        //     reportsTo: reportsTo,
        //     roles: roles
        // }
    );

        this.userService.add(user)
            .subscribe((result: any) => {
                if (result) {
                    this.cancel();
                    this.notificationService.success("User saved successfully.");
                 //   this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
                }
                else {
                    this.notificationService.warning(result.message);
                }
            }, (error) => {
                if (error.status === 400 && error.error.modelState) {
                    this.error = error.error.modelState[''][0];
                } else {
                    this.error = 'Something went wrong';
                }
            });
    }

    private updateUser() {
        let user: User = this.frmUser.value;

        // let reportsTo: Array<{ reportToId: number }> = []
        // const reportsToList = CommonUtility.getSelectedCheckboxList(this.frmUser.value.reportsTo, this.reportsToData);
        // if (CommonUtility.isNotEmpty(reportsToList)) {
        //     reportsToList.forEach((item: List) => {
        //         reportsTo.push({ reportToId: item.id });
        //     });
        // }

        // let roles: Array<{ id: number }> = [];
        // const rolesList = CommonUtility.getSelectedCheckboxList(this.frmUser.value.roles, this.roleData);
        // if (CommonUtility.isNotEmpty(rolesList)) {
        //     rolesList.forEach((item: List) => {
        //         roles.push({ id: item.id });
        //     });
        // }

        this.userData = Object.assign(this.userData, user
        //     , {
        //     reportsTo: reportsTo,
        //     roles: roles
        // }
    );

        this.userService.update(this.userData.id, this.userData)
            .subscribe((result: any) => {
                if (result.isSuccess) {
                    this.cancel();
                    this.notificationService.success("User updated successfully.");
                    this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
                }
                else {
                    this.notificationService.warning(result.message);
                }
            }, (error) => {
                if (error.status === 400 && error.error.modelState) {
                    this.error = error.error.modelState[''][0];
                } else {
                    this.error = 'Something went wrong';
                }
            });
    }

    save() {
        this.isFormSubmitted = true;
       // this.setValidators();

        if (this.frmUser.invalid) {
            return;
        }

        if (this.isEditMode) {
            this.updateUser();
        } else {
            this.createUser();
        }
    }

    setValidators() {
        const rolesList = CommonUtility.getSelectedCheckboxList(this.frmUser.value.roles, this.roleData);

        if (rolesList.some(role => role.name === 'Super Admin')) {
            this.frmUser.controls.parkingAuthorityId.setValidators([]);
        }
        else {
            this.frmUser.controls.parkingAuthorityId.setValidators([Validators.required]);
        }

        this.frmUser.controls.parkingAuthorityId.updateValueAndValidity();
    }

    keyDownHandler(event) {
        if (event.code === 'Space') {
            event.preventDefault();
        }
    }

    cancel() {
        if (this.isEditMode) {
            this.router.navigate(['../..', 'list'], { relativeTo: this.activatedRoute });
        }
        else {
            this.router.navigate(['..', 'list'], { relativeTo: this.activatedRoute });
        }
    }

    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }
}