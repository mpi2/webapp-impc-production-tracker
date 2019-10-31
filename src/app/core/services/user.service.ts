import { Injectable } from '@angular/core';
import { User } from '../model/user/user';
import { map, publishReplay, refCount, flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { Observable, from } from 'rxjs';
import { AssetConfiguration } from '../model/conf/asset-configuration';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServiceUrl;
  private currentLoggedUser: Observable<User>;
  private config$: Observable<AssetConfiguration>;
  readonly TOKEN_INFO_KEY = 'tokenInfo';

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  createUser(user: User) {
    return this.http.post<User[]>(this.apiServiceUrl + '/auth/signup', user)
      .pipe(map(result => {
        // Create user successful if there's a user in the response
        return result;
      }));
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
    return this.config$.pipe(flatMap(response => {
      return this.http.get<User>(response.appServerUrl + '/api/people/currentPerson');
    }));
  }

  getUserByEmail(email: string): Observable<User> {
    return this.config$.pipe(flatMap(response => {
      return this.http.get<User>(response.appServerUrl + '/api/people/' + email);
    }));
  }

}
