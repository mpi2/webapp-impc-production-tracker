import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Priority } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Priority[]>(`${environment.baseUrl}/tracking-api/projectPriorities`);
  }
}
