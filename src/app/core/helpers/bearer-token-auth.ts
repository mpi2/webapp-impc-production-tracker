import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggedUserService } from '../services/logged-user.service';
import { Observable } from 'rxjs';

/**
 * Intercepts the calls to add the authentication token to the requests.
 */
@Injectable()
export class BearerTokenAuth implements HttpInterceptor {
    constructor(private loggedUserService: LoggedUserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.loggedUserService.getAccessToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }
}
