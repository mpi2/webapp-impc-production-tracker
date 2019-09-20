import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from './logged-user.service';
import { ConfigurationDataService } from './configuration-data.service';
import { ConfigAssetLoaderService } from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url;

  constructor(
    private http: HttpClient,
    private loggedUserService: LoggedUserService,
    private configAssetLoaderService: ConfigAssetLoaderService,
    private configurationDataService: ConfigurationDataService) { }

    login(user_name: string, password: string) {
      console.log('this is  a test');
      this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url=data.appServerUrl);
      
      return this.http.post<any>(`${environment.baseUrl}/auth/signin`, { user_name, password })
        .pipe(map(user => {
          console.log('the url is ',this.url);
          
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
