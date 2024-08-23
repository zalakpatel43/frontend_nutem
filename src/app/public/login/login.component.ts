import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserAuthService, APIConstant, CommonUtility } from '@app-core';
import { PublicService } from '../public.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit  {
    frmLogin: UntypedFormGroup = new UntypedFormGroup({});
    isFormSubmitted: boolean = false;
    cookieUserName = '';
    cookiePassword = '';
    hidePassword: boolean = true;
    error: any;
    password: string = "";
    userName: string = "";
    ssoToken: string = '';

    constructor(private router: Router, private fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute,
        private publicService: PublicService, private userAuthService: UserAuthService,
        private cookieService: CookieService) {
        this.createForm();

        const cookieExists: boolean = cookieService.check('Skyward_UserName');
        if (cookieExists) {
            this.cookieUserName = this.cookieService.get('Skyward_UserName');
            this.cookiePassword = this.cookieService.get('Skyward_Password');
            this.frmLogin.controls.username.setValue(this.cookieUserName);
            this.frmLogin.controls.password.setValue(this.cookiePassword);
            this.frmLogin.controls.rememberMe.setValue(true);
        }
    }

    ngOnInit(): void {
        this.getLoginRoute();
    }

    private getLoginRoute() {
        this.activatedRoute.params.subscribe((params) => {
           
        });
    }

    private createForm() {
        this.frmLogin = this.fb.group({
            userName: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [false]
        });
    }

    login() {
        this.isFormSubmitted = true;
        if (!this.frmLogin.valid) {
            return;
        }
        this.error = null;

        const loginData = this.frmLogin.value;
        this.password = loginData.password;
        this.userName = loginData.userName;

        this.publicService.login(loginData)
            .subscribe((result) => {

                if(result.isSuccess == true)
                {
                this.userAuthService.saveToken(result.token);
                this.userAuthService.saveUser(result);

                setTimeout(() => {
                    this.router.navigateByUrl('secure/dashboard');
                }, 0);

                if (loginData.rememberMe === true) {
                    this.cookieService.set('Skyward_User', loginData.userName);
                }
                else {
                    this.cookieService.delete('Skyward_User');
                }
            }
            else
            {
                this.error = { error : [ result.message]}
            }
            }, (error) => {
                if (error && error.status === 400) {
                    this.error = error.error ? (error.error.modelState || null) : null;
                    console.log(this.error);
                }
                else if (error && error.status === 500) {
                    this.error = { error: ["Something went wrong. Please try again later."] };
                }
                else {
                    this.error = { error: ["Please check your internet connection."] };
                }
            });
    }
}