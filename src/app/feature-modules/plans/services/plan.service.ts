import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Plan } from '../model/plan';
import { ChangesHistory } from 'src/app/core';

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
   * @param pin The identifier for the plan.
   */
  getPlanByPid(pin: String) {
    return this.http.get<Plan>(`${environment.baseUrl}/api/plans/${pin}`);
  }

  /**
   * Get a plan using its identifier.
   * @param pin The identifier for the plan.
   */
  getPlanByUrl(url: string) {
    return this.http.get<Plan>(url);
  }

  /**
   * Gets the history of the changes for a plan.
   * @param pin The identifier for the plan.
   */
  getHistoryByPid(pin: String) {
    return this.http.get<ChangesHistory[]>(`${environment.baseUrl}/api/plans/${pin}/history`);
  }

  updatePlan(pin, plan) {
    console.log('Plan to update', plan);

    return this.http.put<any>(`${environment.baseUrl}/api/plans/${pin}`, plan);
  }

  updateProductionPlan(pin: string, plan: Plan) {
    return this.http.put<any>(`${environment.baseUrl}/api/plans/${pin}`, plan);
  }
}
