import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserAuthService, AccountService, CommonUtility, APIConstant, PermissionType, ApplicationPage } from '@app-core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { PublicService } from 'src/app/public/public.service';

@Component({
    selector: 'header-bar',
    templateUrl: './header-bar.component.html',
    styleUrls: ['header-bar.component.scss']
})

export class HeaderBarComponent implements OnInit, OnDestroy {
    basePath: string = APIConstant.basePath;
    permissions = PermissionType;
    userPage: string = ApplicationPage.user;
    rolePage: string = ApplicationPage.role;
    permissionPage: string = ApplicationPage.permission;
    groupCodePage: string = ApplicationPage.group_code;
    changeCredentialPage: string = ApplicationPage.changepassword;
    moduleGroupPage: string = ApplicationPage.moduleGroup;
    userName: string = '';
    imagePath: string = 'assets/images/logo.png';
    locationImage: string = '';
    companyPage: string = ApplicationPage.changepassword;
    modulePage: string = ApplicationPage.module;
    bomPage: string = ApplicationPage.bom;
    termsAndConditionsPage: string = ApplicationPage.termsAndConditions;
    customerPage: string = ApplicationPage.customer;
    productPage: string = ApplicationPage.product;
    salesOrderPage: string = ApplicationPage.salesOrder;
    vendorMasterPage: string = ApplicationPage.vendorMaster;
    workflowMasterPage: string = ApplicationPage.workflow;
    purchaseOrderPage: string = ApplicationPage.purchaseOrder;
    inventoryTypePage: string = ApplicationPage.inventoryType;
    inwardPage: string = ApplicationPage.inward;
    outwardPage: string = ApplicationPage.outward;
    qualityParameterPage: string = ApplicationPage.qualityParameter;
    materialRequisitionPage: string = ApplicationPage.materialRequisition;
    locationPage: string = ApplicationPage.location;

    constructor(private router: Router, private accountService: AccountService,
        private userAuthService: UserAuthService, private appService: AppService,
        private publicService: PublicService) {
    }

    ngOnInit() {
        this.getUser();
    }

    private getUser() {
        const user: any = this.userAuthService.getUser();
        if (user) {
            this.userName = (CommonUtility.isNotEmpty(user.firstName) ? user.firstName : '') + ' '
                + (CommonUtility.isNotEmpty(user.lastName) ? user.lastName : '');
        }

    }

    changePassword() {
        this.router.navigate(['/secure/masters/change-password']);
    }

    changeCredential() {
        this.router.navigate(['/secure/masters/change-credential']);
    }

    profile() {
        this.router.navigate(['/secure/user-profile']);
    }

    ngOnDestroy(): void {

    }
}