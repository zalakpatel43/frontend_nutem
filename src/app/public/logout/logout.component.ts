import { Component, OnInit } from '@angular/core';
import { UserAuthService, AccountService } from '@app-core';
import { Router } from '@angular/router';

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html'
})

export class LogoutComponent implements OnInit {

    constructor(private router: Router, private accountService: AccountService,
        private userAuthService: UserAuthService) {
    }

    ngOnInit() {
        this.logout();
    }

    logout() {
       
                this.userAuthService.loggedOut();
                setTimeout(() => {
                    this.router.navigate(['login']);
                });
            }
}