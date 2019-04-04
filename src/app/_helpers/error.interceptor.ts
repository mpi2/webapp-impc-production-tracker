import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
            if (err.status === 403) {
                // redirect to login if 403
                this.router.navigateByUrl(`/login`);
            }

            console.log('err interceptor: ', err);

            let error = '';

            if (err.error.apiexception) {
                error = err.error.apiexception.message || err.statusText;
                if (err.error.apiexception.subErrors != null) {
                    error += ': ' + err.error.apiexception.subErrors[0].message;
                }
                if (err.error.apiexception.debubMessage != null) {
                    error += ': ' + err.error.apiexception.debubMessage;
                }
            } else {
                error = err.error.message;
            }

            return throwError(error);
        }));
    }
}
