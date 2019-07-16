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
   * Gets the history of the changes for a plan.
   * @param pin The identifier for the plan.
   */
  getHistoryByPid(pin: String) {
    return this.http.get<ChangesHistory[]>(`${environment.baseUrl}/api/plans/${pin}/history`);
  }

  updatePlan(pin, plan) {
    return this.http.put<any>(`${environment.baseUrl}/api/plans/${pin}`, plan);
  }

  updateProductionPlan(pin: string, plan: Plan, updatePlanDetails: boolean, updateAttempt: boolean) {
    const payLoad = this.getProductionPlanPayload(plan, updatePlanDetails, updateAttempt);
    console.log('payLoad', payLoad);
    
    return this.http.put<any>(`${environment.baseUrl}/api/plans/${pin}`, payLoad);
  }

  /**
   * Returns an object with the structure needed by the server to be able to update a plan.
   * @param plan Plan object to convert.
   */
  getPayloadObject(plan: Plan, updatePlanDetails: boolean, updateAttempt) {
    const payload: any = {};
    payload.planDetails = plan.planDetails

  }

  getProductionPlanPayload(plan: Plan, updatePlanDetails: boolean, updateAttempt: boolean) {
    const payload: any = {};
    if (updatePlanDetails) {
      payload.planDetails = plan.planDetails;
    }
    if (updateAttempt) {
      let attempt: any = {};
      payload.productionPlan = {};
      attempt.attemptType = plan.productionPlan.attemptType;
      attempt.crisprAttempt = plan.productionPlan.crisprAttempt;
      payload.productionPlan.attempt = attempt;
    }
    return payload;
  }
}
