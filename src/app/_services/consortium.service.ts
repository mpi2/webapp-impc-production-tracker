import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Consortium } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ConsortiumService {

  constructor(private http: HttpClient) {}
  getAll() {
    return this.http.get<Consortium[]>(`${environment.baseUrl}/tracking-api/consortia`);
  }
}
