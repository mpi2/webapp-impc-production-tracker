import {Injectable, Inject} from '@angular/core';
import {EMPTY, from, Observable} from 'rxjs';
import {MessageService} from './message.service';
import {Permission} from '../model/conf/permission';
import {HttpClient} from '@angular/common/http';
import {mergeMap, map} from 'rxjs/operators';
import {ConfigAssetLoaderService} from './config-asset-loader.service';
import {AuthenticationResponse} from '../model/user/authentication-response';
import {AssetConfiguration} from '../model/conf/asset-configuration';
import {User} from '../model/user/user';
import {UserService} from './user.service';

import { BASE_API_URL_TOKEN } from 'src/app/injectors';


@Injectable({
  providedIn: 'root'
})
/**
 * Class to keep information about the current user logged into the application.
 */
export class LoggedUserService {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly TOKEN_INFO_KEY = 'tokenInfo';
  private apiServiceUrl;
  private config$: Observable<AssetConfiguration>;

  constructor(
    @Inject(BASE_API_URL_TOKEN) public baseUrl: string,
    private http: HttpClient,
    private messageService: MessageService,
    private configAssetLoaderService: ConfigAssetLoaderService,
    private userService: UserService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);

    if (this.apiServiceUrl === undefined) {
      this.apiServiceUrl = baseUrl;
    }
  }

  // Returns a key unique to this application that takes into account the base path as well as the host and port
  getKey(key) {
    return this.apiServiceUrl + '_' + key;
  }

  // Returns an object with permissions for the logged user.
  getPermissions() {
    return this.config$.pipe(mergeMap(response => this.http.get<Permission>(this.apiServiceUrl + '/api/permissions')));
  }

  getAccessToken(): string {
    const logginInfo: AuthenticationResponse = JSON.parse(localStorage.getItem(this.getKey(this.TOKEN_INFO_KEY)));
    return logginInfo ? logginInfo.accessToken : null;
  }

  storeToken(tokenInfo: any): void {
    localStorage.setItem(this.getKey(this.TOKEN_INFO_KEY), JSON.stringify(tokenInfo));
    this.messageService.setUserLoggedIn(true);
  }

  removeToken(): void {
    this.userService.clearCurrentLoggedUser();
    localStorage.removeItem(this.getKey(this.TOKEN_INFO_KEY));
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
