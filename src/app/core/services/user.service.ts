import {Injectable} from '@angular/core';
import {User} from '../model/user/user';
import {map, publishReplay, refCount, mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ConfigAssetLoaderService} from './config-asset-loader.service';
import {Observable, from} from 'rxjs';
import {AssetConfiguration} from '../model/conf/asset-configuration';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly TOKEN_INFO_KEY = 'tokenInfo';

  private apiServiceUrl;
  private currentLoggedUser: Observable<User>;
  private config$: Observable<AssetConfiguration>;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  public createUser(user: User) {
    return this.http.post<User>(this.apiServiceUrl + '/api/people', user);
  }

  getCurrentLoggedUser(): Observable<User> {
    if (!this.currentLoggedUser) {
      this.currentLoggedUser = this.fetchCurrentLoggedUser().pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.currentLoggedUser;
  }

  clearCurrentLoggedUser() {
    this.currentLoggedUser = null;
  }

  fetchCurrentLoggedUser(): Observable<User> {
    return this.config$.pipe(mergeMap(response => this.http.get<User>(response.appServerUrl + '/api/people/currentPerson')));
  }

  getUserByEmail(email: string): Observable<User> {
    return this.config$.pipe(mergeMap(response => this.http.get<User>(response.appServerUrl + '/api/people/' + email)));
  }

  updateUser(user: User) {
    return this.http.put<User[]>(this.apiServiceUrl + '/api/people', user)
      .pipe(map(result => result));
  }

  resetPassword() {
    return this.http.put(this.apiServiceUrl + '/api/people/resetPassword', {})
      .pipe(map(result => result));
  }

}
