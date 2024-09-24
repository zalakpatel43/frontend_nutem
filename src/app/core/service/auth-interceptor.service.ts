import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";
import { CommonConstant, PublicAPI } from "../constant";
import { Observable } from "rxjs";
import jwt_decode from "jwt-decode";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (PublicAPI.some(x => req.url.indexOf(x) > -1)) {
            return next.handle(req);
        }

        const token = window.localStorage.getItem(CommonConstant.token);
        if (token) {
            // Check if the token is expired
            // const tokenExpiration = this.getTokenExpiration(token);
            // const isExpired = this.isTokenExpired(tokenExpiration);

            // if (isExpired) {
            //     // Handle session timeout: Log the user out or redirect to login
            //     this.handleSessionTimeout();
            //     return next.handle(req);  // Avoid attaching the expired token
            // }


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

     // Helper function to decode the token and get its expiration time
     private getTokenExpiration(token: string): number {
        const decodedToken: any = jwt_decode(token);
        return decodedToken?.exp ? decodedToken.exp * 1000 : 0;  // 'exp' is in seconds, so convert to milliseconds
    }

    // Check if the token is expired
    private isTokenExpired(expiration: number): boolean {
        return Date.now() >= expiration;
    }

    // Handle session timeout (remove token and redirect to login)
    private handleSessionTimeout() {
        window.localStorage.removeItem(CommonConstant.token);
        alert('Your session has expired. Please log in again.');
        this.router.navigate(['/login']);  // Redirect to login page
    }
}