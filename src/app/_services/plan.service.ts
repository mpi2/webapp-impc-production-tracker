import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { PlanSummary } from '../_models/project/planSummary';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  getAllPlanSummaries() {
    console.log('Getting all Plan Summaries the user can see');
    return this.http.get<PlanSummary[]>(`${environment.baseUrl}/api/planSummaries`);
  }
  getAllPlanSummariesWithPage(page: number) {
    console.log('Getting all Plan Summaries the user can see with page');
    return this.http.get<PlanSummary[]>(`${environment.baseUrl}/api/planSummaries?page=${page}`);
  }
}
