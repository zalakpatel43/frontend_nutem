import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChangePassword, List } from '@app-models';
import { NotificationService, AccountService, UserAuthService } from '@app-core';
import { ValidationService } from '@app-shared';
import { Router } from '@angular/router';
import { MasterService } from '../masters.service';

@Component({
    templateUrl: './change-credentials.component.html',
    styleUrls: ['change-credentials.component.scss']
})

export class ChangeCredentialsComponent implements OnInit, OnDestroy {   
    form: NgForm;
    changePasswordData: ChangePassword;
    companyId: number;
    isEditMode: boolean;
    frmPassword: UntypedFormGroup;
    routerSub: Subscription;
    isFormSubmitted: boolean;
    error: string;
    townData : List[] = [];
    userData : List[]=[];
    hideNewPassword: boolean = true;
    hideConfirmPassword: boolean = true;


    constructor(private formBuilder: UntypedFormBuilder, private accountService: AccountService,
        private userAuthService: UserAuthService, private router: Router,
        private masterService: MasterService, private toastrService: NotificationService) {
        this.createForm();

    }

    ngOnInit(): void {
        this.getParkingAuthoritiesData();
    }

    createForm() {
        this.frmPassword = this.formBuilder.group({
            parkingAuthorityId : ['',Validators.required],
            userId:['',Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, ValidationService.compareNewPassword]]
        });
    }

    getParkingAuthoritiesData()
    {
        // this.masterService.getParkingAuthrotiesByUserId().subscribe(
        //     (result)=>
        //     {
        //         this.townData = result;
        //     },(error)=>{
        //         this.townData = [];
        //     }
        // )
    }

    private changePassword() {
        this.isFormSubmitted = true;
        if (!this.frmPassword.valid) {
            return;
        }
        let changePassword = this.frmPassword.value;
        this.changePasswordData = new ChangePassword();
        this.changePasswordData.userId = changePassword.userId;
        this.changePasswordData.password = changePassword.newPassword;
        this.masterService.changePassword(this.changePasswordData)
            .subscribe((result) => {
                this.toastrService.success("Password has been changed successfully.");
                this.frmPassword.reset();
                this.isFormSubmitted = false;
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

    townChanged()
    {
        let parkingAuthorityId : number= this.frmPassword.controls.parkingAuthorityId.value;
        // this.masterService.getTownUsers(parkingAuthorityId).subscribe(
        //     (result) =>
        //     {
        //         this.userData = result;
        //     },(error)=>
        //     {
        //         this.userData = [];
        //     }
        // );
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
