import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkGroup } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkGroupService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/tracking-api/workGroups`);
  }

  getByWorkUnit(name: string) {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/api/workGroups?workUnitName=${name}`);
  }
}
