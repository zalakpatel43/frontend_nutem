import { Injectable } from "@angular/core";
import { BaseService } from "@app-core";
import { Subject } from "rxjs";

@Injectable()
export class AppService {

    private profileNameDataSource = new Subject();
    profileName$ = this.profileNameDataSource.asObservable();

    private menuBarDataSource = new Subject();
    menuBar$ = this.menuBarDataSource.asObservable();


    constructor(private baseService: BaseService) {

    }   

    setProfileName(userName: string) {
        this.profileNameDataSource.next(userName);
    }

    setMenuBar(visible: boolean) {
        this.menuBarDataSource.next(visible);
    }
}