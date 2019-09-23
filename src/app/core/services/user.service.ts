import { Injectable } from '@angular/core';
import { User } from '../model/user/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {ConfigAssetLoaderService} from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url = data.appServerUrl);
  }

  createUser(user: User) {
    return this.http.post<User[]>(this.url + '/auth/signup', user)
        .pipe(map(result => {
            // Create user successful if there's a user in the response
            return result;
        }));
  }
}
