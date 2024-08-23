import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EventService } from './event';
import {
    UserAuthService, BaseService,
    ListService, AccountService, NotificationService
} from './service';
import { AuthGuard, PageAuthGuard } from './guards';

@NgModule({ imports: [], providers: [
        EventService,
        UserAuthService,
        BaseService,
        ListService,
        AccountService,
        AuthGuard,
        NotificationService,
        PageAuthGuard,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class CoreModule { }
