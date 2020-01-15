import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from './api-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            return this.handleError(err);
        }));
    }

    handleError(errorResponse: HttpErrorResponse) {
        this.handlePermissionError(errorResponse);
        let errorMessage = '';
        const apiError = this.getApiError(errorResponse);

        if (apiError) {
            errorMessage = apiError.message;
        } else {
            if ('HttpErrorResponse' === errorResponse.name) {
                errorMessage = 'Error while comminicating with the server. Check that the server is available.';
            } else {
                errorMessage = 'Unknown error';
            }
        }
        return throwError(errorMessage);
    }

    private handlePermissionError(errorResponse: HttpErrorResponse) {
        if (this.isUnauthorisedError(errorResponse) || this.isForbiddenError(errorResponse)) {
            window.alert(
                'Access denied. Please log as a user with the corresponding permissions ' +
                'to execute the required action.');
            this.authenticationService.logout();
            this.router.navigateByUrl(`/login`);
        }
    }

    private getApiError(errorResponse: HttpErrorResponse): ApiError {
        let apiError;
        if (errorResponse.error.apierror) {
            apiError = errorResponse.error.apierror;
        } else if (errorResponse.statusText !== 'Unknown Error') {
            const errorObject = JSON.parse(errorResponse.error);
            apiError = errorObject.apierror;
        }
        return apiError;
    }

    isUnauthorisedError(error): boolean {
        return error.status === 401;
    }

    isForbiddenError(error): boolean {
        return error.status === 403;
    }

    isNotFoundError(error): boolean {
        return error.status === 404;
    }

    hasApiErrorFormat(error): boolean {
        const errorObject = JSON.parse(error);
        return errorObject.apierror;
    }
}
