import { Injectable } from '@angular/core';
import { User } from '../model/user/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(user: User) {
    return this.http.post<User[]>(`${environment.baseUrl}/auth/signup`, user)
        .pipe(map(result => {
            // Create user successful if there's a user in the response
            return result;
        }));
  }
}
