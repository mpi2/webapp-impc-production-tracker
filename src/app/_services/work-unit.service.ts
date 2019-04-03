import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WorkUnit } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkUnitService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<WorkUnit[]>(`${environment.baseUrl}/tracking-api/workUnits`);
  }
}
