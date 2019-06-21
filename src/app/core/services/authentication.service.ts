import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { LoggedUserService } from './logged-user.service';
import { ConfigurationDataService } from './configuration-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private loggedUserService: LoggedUserService, private configurationDataService: ConfigurationDataService) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.baseUrl}/auth/signin`, { username, password })
      .pipe(map(user => {
        // login successful if there's a user in the response
        if (user) {
          this.loggedUserService.storeLoggedUser(user);
          //this.loadInitialConfiguration();
          this.configurationDataService.writeConfiguration();
        }

        return user;
      }));
  }

  logout() {
    this.loggedUserService.removeLoggedUser();
  }
}
