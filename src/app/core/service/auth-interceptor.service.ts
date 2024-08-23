import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";
import { CommonConstant, PublicAPI } from "../constant";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (PublicAPI.some(x => req.url.indexOf(x) > -1)) {
            return next.handle(req);
        }

        const token = window.localStorage.getItem(CommonConstant.token);
        if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
        } else {
            console.warn('Token is missing');
        }

        if (req.url.indexOf("api/report") > -1) {
            req = req.clone({ responseType: 'blob' });
        }
        else {
            req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        }

        return next.handle(req);
    }
}