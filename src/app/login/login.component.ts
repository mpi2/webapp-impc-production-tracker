import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    model: any = {};
    dangerMessage: string;

    constructor(
        // private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit() {
        sessionStorage.setItem('token', '');
    }

    login() {
        const url = 'http://localhost:8080/auth/signin';
        this.http.post(url, {
            username: this.model.username,
            password: this.model.password
        }).subscribe(
            data => {
                sessionStorage.setItem('token', JSON.stringify(data));
                this.router.navigate(['']);
                this.dangerMessage = null;
            },
            error => {
                console.log('log in failed: ', error);
                this.dangerMessage = 'Wrong credentials.';
            }
        );
    }
}
