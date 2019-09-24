import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoggedUserService } from './logged-user.service';
import { ConfigurationDataService } from './configuration-data.service';
import { ConfigAssetLoaderService } from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiServiceUrl;

  constructor(
    private http: HttpClient,
    private loggedUserService: LoggedUserService,
    private configAssetLoaderService: ConfigAssetLoaderService,
    private configurationDataService: ConfigurationDataService) {
      this.configAssetLoaderService.loadConfigurations().subscribe(data => this.apiServiceUrl = data.appServerUrl);
     }

    login(user_name: string, password: string) {
      return this.http.post<any>(this.apiServiceUrl + '/auth/signin', { user_name, password })
        .pipe(map(user => {
          // login successful if there's a user in the response
          if (user) {
            this.loggedUserService.storeLoggedUser(user);
            this.configurationDataService.writeConfiguration();
          }
          return user;
        }));
    }

    logout() {
      this.loggedUserService.removeLoggedUser();
    }
}
