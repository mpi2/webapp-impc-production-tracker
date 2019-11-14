import { HttpInterceptor, HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authHeader = request.headers.get('Authorization');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            // pass through any requests not handled above

            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown
            // (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        // private helper functions

        function getGenes() {
            const genes = [
                {
                    name: 'Nxn',
                    id: 'MGI:123456'
                }
            ];
            return genes;
        }

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    // useClass: FakeBackendInterceptor,
    multi: true
};

