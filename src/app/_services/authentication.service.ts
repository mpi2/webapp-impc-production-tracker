import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { ConfigurationService } from './configuration.service';

@Injectable({ providedIn: 'root' })

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private conf: ConfigurationService) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.baseUrl}/auth/signin`, { username, password })
      .pipe(map(user => {
        // login successful if there's a user in the response
        if (user) {
          // store user details and basic auth credentials in local storage
          // to keep user logged in between page refreshes
          // user.authdata = window.btoa(username + ':' + password);
          sessionStorage.setItem('tokenInfo', JSON.stringify(user));
          console.log('loadInitialConfiguration');

          this.loadInitialConfiguration();
        }

        return user;
      }));
  }

  loadInitialConfiguration() {
    this.conf.getConfiguration().subscribe(data => {
      sessionStorage.setItem('conf', JSON.stringify(data));      
    }); 
  }


  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('tokenInfo');
  }
}
