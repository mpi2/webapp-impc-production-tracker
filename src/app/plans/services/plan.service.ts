import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Plan } from '../model/plan';
import { ChangesHistory } from 'src/app/core/model/changes-history';

/**
 * Class that provides information for plans.
 */
@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  /**
   * Get a plan using its identifier.
   * @param pid The identifier for the plan.
   */
  getPlanByPid(pid: String) {
    return this.http.get<Plan>(`${environment.baseUrl}/api/plans/${pid}`);
  }

  getHistoryByPid(pid: String) {
    return this.http.get<ChangesHistory[]>(`${environment.baseUrl}/api/plans/${pid}/history`);
  }
}
