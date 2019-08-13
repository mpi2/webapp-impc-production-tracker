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

  updateProductionPlan(pin: string, plan: Plan, updatePlanDetails: boolean, updateAttempt: boolean) {
    const payLoad = this.getProductionPlanPayload(plan, updatePlanDetails, updateAttempt);
    console.log('payLoad', payLoad);

    return this.http.put<any>(`${environment.baseUrl}/api/plans/${pin}`, payLoad);
  }

  getProductionPlanPayload(plan: Plan, updatePlanDetails: boolean, updateAttempt: boolean) {
    let payload: any = {};
    if (updatePlanDetails) {
      payload = this.getPayloadForBasicDataPlan(plan);
    }
    if (updateAttempt) {
      payload.crispr_attempt_attributes = plan.crispr_attempt_attributes;
    }
    return payload;
  }

  private getPayloadForBasicDataPlan(plan: Plan) {
    let payload: any = {};
    payload.id = plan.id;
    payload.pin = plan.pin;
    payload.work_group_name = plan.work_group_name;
    payload.work_unit_name = plan.work_unit_name;
    payload.products_available_for_general_public = plan.products_available_for_general_public;
    payload.funder_name = plan.funder_name;
    payload.consortium_name = plan.consortium_name;
    payload.comment = plan.comment;

    return payload;
  }
}
