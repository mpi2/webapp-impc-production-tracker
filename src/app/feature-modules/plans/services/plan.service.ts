import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plan } from '../model/plan';
import {ConfigAssetLoaderService} from '../../../core/services/config-asset-loader.service';
import { ChangesHistory } from 'src/app/core';

/**
 * Class that provides information for plans.
 */
@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  /**
   * Get a plan using its identifier.
   * @param pin The identifier for the plan.
   */
  getPlanByPin(pin: string) {
    return this.http.get<Plan>(this.apiServiceUrl + '/api/plans/' + pin );
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
  getHistoryByPid(pin: string) {
    return this.http.get<ChangesHistory[]>(this.apiServiceUrl + '/api/plans/' + pin + '/history');
  }

  updatePlan(pin, plan) {
    return this.http.put<any>(this.apiServiceUrl + '/api/plans/' + pin, plan);
  }

  updateProductionPlan(pin: string, plan: Plan) {
    return this.http.put<any>(this.apiServiceUrl + '/api/plans/' + pin, plan);
  }
}
