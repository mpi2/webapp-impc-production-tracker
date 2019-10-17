import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoggedUserService } from './logged-user.service';
import { ConfigurationDataService } from './configuration-data.service';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { AuthenticationRequest } from '../model/user/authentication-request';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiServiceUrl;

  constructor(
    private http: HttpClient,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private configAssetLoaderService: ConfigAssetLoaderService,
    private messageService: MessageService) {

    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  login(userName: string, password: string) {
    const authenticationRequest = new AuthenticationRequest();
    authenticationRequest.userName = userName;
    authenticationRequest.password = password;

    return this.http.post<AuthenticationRequest>(this.apiServiceUrl + '/auth/signin', authenticationRequest).pipe(tap(res => {
      this.loggedUserService.storeToken(res);
    }));
  }

  logout() {
    this.loggedUserService.removeToken();
  }
}
