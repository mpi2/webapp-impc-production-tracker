import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  model: any = {};
  workUnits: Observable<any>;
  workGroups: Observable<any>;
  consortia: Observable<any>;
  institutes: Observable<any>;
  roles: Observable<any>;

  constructor(
    private router: Router,
    private http: HttpClient) { }

  ngOnInit() {
    const wuUrl = 'http://localhost:8080/tracking-api/workUnits';
    const wgUrl = 'http://localhost:8080/tracking-api/workGroups';
    const cUrl = 'http://localhost:8080/tracking-api/consortia';
    const iUrl = 'http://localhost:8080/tracking-api/institutes';
    const rUrl = 'http://localhost:8080/tracking-api/roles';

    let headers: HttpHeaders = new HttpHeaders();

    console.log(sessionStorage.getItem('token'));

    if (sessionStorage.getItem('token') != null) {
        const tokenInfo = JSON.parse(sessionStorage.getItem('token'));
        headers = new HttpHeaders({
            Authorization: 'Bearer ' + tokenInfo.access_token
        });
    }

    const options = { headers };
    console.log(headers);

    this.workUnits = this.http.get(wuUrl, options).pipe(
      map(response => response['_embedded']['workUnits'])
    );
    this.workGroups = this.http.get(wgUrl, options).pipe(
      map(response => response['_embedded']['workGroups'])
    );
    this.consortia = this.http.get(cUrl, options).pipe(
      map(response => response['_embedded']['consortia'])
    );
    this.institutes = this.http.get(iUrl, options).pipe(
      map(response => response['_embedded']['institutes'])
    );

    this.roles = this.http.get(rUrl, options).pipe(
      map(response => response['_embedded']['roles'])
    );
  }

  singup() {
    const url = 'http://localhost:8080/auth/signup';

    let headers: HttpHeaders = new HttpHeaders();

    console.log(sessionStorage.getItem('token'));

    if (sessionStorage.getItem('token') != null) {
        const tokenInfo = JSON.parse(sessionStorage.getItem('token'));
        headers = new HttpHeaders({
            Authorization: 'Bearer ' + tokenInfo.access_token
        });
    }

    const options = { headers };
    console.log(headers);

    this.http.post(url, {
        name: this.model.name,
        password: this.model.password,
        email: this.model.email,
        workUnitName: this.model.workUnit,
        instituteName: this.model.institute,
        roleName: this.model.role
    }, options).subscribe(
        data => {
            console.log('User created.', data);
            // this.dangerMessage = null;
        },
        error => {
            console.log('Sign up failed: ', error);
            // this.dangerMessage = 'Wrong credentials.';
        }
    );
  }
}
