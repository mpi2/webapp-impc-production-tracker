import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BearerTokenAuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const tokenInfo = JSON.parse(sessionStorage.getItem('tokenInfo'));
        if (tokenInfo && tokenInfo.access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${tokenInfo.access_token}`
                }
            });
        }

        return next.handle(request);
    }
}
