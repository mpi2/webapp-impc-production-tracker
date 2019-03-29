import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    username: string;

    plans: Observable<any>;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        const url = 'http://localhost:8080/api/plans';

        let headers: HttpHeaders = new HttpHeaders();

        if (sessionStorage.getItem('token') != null) {
            const tokenInfo = JSON.parse(sessionStorage.getItem('token'));
            headers = new HttpHeaders({
                Authorization: 'Bearer ' + tokenInfo.access_token
            });
        }

        const options = { headers };

        console.log('headers: ', headers);
        console.log('options: ', options);

        // tslint:disable-next-line:ban-types
        this.plans = this.http.get<Observable<Object>>(url, options);
        console.log(this.plans);
    }

    logout() {
        // sessionStorage.setItem('token', '');
        sessionStorage.removeItem('token');
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        return throwError(
          'Something bad happened; please try again later.');
      }
}
