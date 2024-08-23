import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChangePassword } from '@app-models';
import { NotificationService, AccountService, UserAuthService } from '@app-core';
import { ValidationService } from '@app-shared';
import { Router } from '@angular/router';
import { MasterService } from '../masters.service';

@Component({
    templateUrl: './change-password.component.html',
    styleUrls: ['change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit, OnDestroy {   
    form: NgForm;
    changePasswordData: ChangePassword;
    companyId: number;
    isEditMode: boolean;
    frmPassword: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    error: string;

    hideNewPassword: boolean = true;
    hideConfirmPassword: boolean = true;


    constructor(private formBuilder: UntypedFormBuilder, private accountService: AccountService,
        private userAuthService: UserAuthService, private router: Router,
        private masterService: MasterService, private toastrService: NotificationService) {
        this.createForm();

    }

    ngOnInit(): void {

    }

    createForm() {
        this.frmPassword = this.formBuilder.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, ValidationService.compareNewPassword]]
        });
    }

    private changePassword() {
        this.isFormSubmitted = true;
        if (!this.frmPassword.valid) {
            return;
        }
        let user = this.userAuthService.getUser();
        var userId : number = user.id;
        let changePassword = this.frmPassword.value;
        this.changePasswordData = new ChangePassword();
        this.changePasswordData.userId = userId;
        this.changePasswordData.password = changePassword.newPassword;
        this.masterService.changePassword(this.changePasswordData)
            .subscribe((result) => {
                this.toastrService.success("Password has been changed successfully.");
                this.frmPassword.reset();
                this.userAuthService.loggedOut();
                setTimeout(() => {
                    this.router.navigate(['login']);
                });
            }, (error) => {
                if (error.status === 400 && error.error.modelState) {
                    this.error = "";
                    Object.keys(error.error.modelState).forEach(key => {
                        this.error += `\n${error.error.modelState[key][0]}.`
                    });
                } else if (error.status === 404) {
                    this.error = "Invalid email";
                } else {
                    this.error = 'Something went wrong';
                }
            });
    }




    save() {
        this.isFormSubmitted = true;
        if (this.frmPassword.invalid) {
            return;
        }
        this.changePassword();
    }

    ngOnDestroy(): void {

    }
}
