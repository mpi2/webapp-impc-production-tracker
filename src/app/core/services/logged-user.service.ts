import { Injectable } from '@angular/core';
import { LoggedUser } from '../model/user/logged-user';
import { Observable, EMPTY, from } from 'rxjs';
import { MessageService } from './message.service';
import { Permission } from '../model/conf/permission';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { AuthenticationResponse } from '../model/user/authentication-response';
import { AssetConfiguration } from '../model/conf/asset-configuration';

@Injectable({
  providedIn: 'root'
})
/**
 * Class to keep information about the current user logged into the application.
 */
export class LoggedUserService {

  private apiServiceUrl;

  readonly TOKEN_INFO_KEY = 'tokenInfo';

  private config$: Observable<AssetConfiguration>;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private configAssetLoaderService: ConfigAssetLoaderService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
  }

  // Returns an object with permissions for the logged user.
  getPermissions() {
    return this.config$.pipe(flatMap(response => {
      return this.http.get<Permission>(this.apiServiceUrl + '/api/permissions');
    }));
  }

  getSecurityInformation(): Observable<LoggedUser> {
    return this.config$.pipe(flatMap(response => {
      return this.http.get<LoggedUser>(response.appServerUrl + '/auth/securityInformation');
    }));
  }

  getAccessToken(): string {
    const logginInfo: AuthenticationResponse = JSON.parse(localStorage.getItem(this.TOKEN_INFO_KEY));
    return logginInfo ? logginInfo.accessToken : null;
  }

  storeToken(tokenInfo: any): void {
    localStorage.setItem(this.TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
    this.messageService.setUserLoggedIn(true);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_INFO_KEY);
    this.messageService.setUserLoggedIn(false);
  }

  getLoggerUser(): Observable<LoggedUser> {
    let loggedUser$: Observable<LoggedUser>;
    if (!this.getAccessToken()) {
      loggedUser$ = EMPTY;
    } else {
      loggedUser$ = this.getSecurityInformation();
      return loggedUser$;
    }
  }

  evaluatePermission(action: string): Observable<boolean> {
    return this.getPermissions().pipe(map(v => {
      switch (action) {
        case 'register-user':
          return !v.canRegisterUser;
          break;
        default:
          return false;
      }
    }));
  }
}
