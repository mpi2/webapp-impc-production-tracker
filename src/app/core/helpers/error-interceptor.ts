import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            return this.handleError(err);
        }));
    }

    handleError(error) {
        if (this.isUnauthorisedError(error) || this.isForbiddenError(error)) {
            window.alert('Access denied. Please log as a user with the corresponding permissions to execute the required action.');
            this.authenticationService.logout();
            //location.reload(true);
            this.router.navigateByUrl(`/login`);
        } else {
            let errorMessage = '';

            if (this.isNotFoundError(error)) {
                errorMessage = 'The server cannot find the requested resource. Path: ' + error.error.path;
            }
            else if (this.hasApiErrorFormat(error)) {
                errorMessage = this.getApiErrorMessage(error);

            } else {
                if ('HttpErrorResponse' === error.name) {
                    console.log(error);

                    errorMessage = 'Error while comminicating with the server. Check that the server is available.';
                } else {
                    errorMessage = 'Unknown error';
                }
            }
            return throwError(errorMessage);
        }
    }

    isUnauthorisedError(error): boolean {
        return error.status === 401
    }

    isForbiddenError(error): boolean {
        return error.status === 403
    }

    isNotFoundError(error): boolean {
        return error.status === 404
    }

    hasApiErrorFormat(error): boolean {
        return error.error.apierror;
    }

    getApiErrorMessage(error) {
        let errorMessage = error.error.apierror.message || error.statusText;
        if (error.error.apierror.subErrors != null) {
            errorMessage += ': ' + error.error.apierror.subErrors[0].message;
        }
        if (error.error.apierror.debubMessage != null) {
            errorMessage += ': ' + error.error.apierror.debubMessage;
        }
        return errorMessage;
    }
}
