import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Institute } from '../_models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Institute[]>(`${environment.baseUrl}/tracking-api/institutes`);
  }
}
