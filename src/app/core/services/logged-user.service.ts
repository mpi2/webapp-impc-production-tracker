import { Injectable } from '@angular/core';
import { Observable, EMPTY, from } from 'rxjs';
import { MessageService } from './message.service';
import { Permission } from '../model/conf/permission';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { AuthenticationResponse } from '../model/user/authentication-response';
import { AssetConfiguration } from '../model/conf/asset-configuration';
import { User } from '../model/user/user';
import { UserService } from './user.service';

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
    private configAssetLoaderService: ConfigAssetLoaderService,
    private userService: UserService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
  }

  // Returns an object with permissions for the logged user.
  getPermissions() {
    return this.config$.pipe(flatMap(response => {
      return this.http.get<Permission>(this.apiServiceUrl + '/api/permissions');
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
    console.log('removing token...');
    this.userService.clearCurrentLoggedUser();
    localStorage.removeItem(this.TOKEN_INFO_KEY);
    this.messageService.setUserLoggedIn(false);
  }

  getLoggerUser(): Observable<User> {
    let loggedUser$: Observable<User>;
    if (!this.getAccessToken()) {
      loggedUser$ = EMPTY;
    } else {
      loggedUser$ = this.userService.getCurrentLoggedUser();
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
