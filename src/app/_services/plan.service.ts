import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ProjectSummary } from '../_models/project/projectSummary';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  getAllPlanSummaries() {
    console.log('Getting all Plan Summaries the user can see');
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projectSummaries`);
  }
  getAllPlanSummariesWithPage(page: number) {
    console.log('Getting all Plan Summaries the user can see with page');
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projectSummaries?page=${page}`);
  }
}
