import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkGroup } from '../model/organisation/work-group';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkGroupService {

  constructor(private http: HttpClient) { }

  getAllWorkGroups() {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/tracking-api/workGroups`);
  }

  getWorkGroupByWorkUnit(name: string) {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/api/workGroups?workUnitName=${name}`);
  }
}
