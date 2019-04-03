import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Plan } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Plan[]>(`${environment.baseUrl}/api/plans`);
  }
}
