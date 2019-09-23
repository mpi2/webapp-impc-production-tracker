import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Plan } from '../model/plan';
import { ChangesHistory } from 'src/app/core';
import {ConfigAssetLoaderService} from '../../../core/services/config-asset-loader.service';

/**
 * Class that provides information for plans.
 */
@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private url;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url = data.appServerUrl);
  }

  /**
   * Get a plan using its identifier.
   * @param pin The identifier for the plan.
   */
  getPlanByPin(pin: string) {
    return this.http.get<Plan>(this.url + '/api/plans/' + pin );
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
    return this.http.get<ChangesHistory[]>(this.url + '/api/plans/' + pin + '/history');
  }

  updatePlan(pin, plan) {
    console.log('Plan to update', plan);

    return this.http.put<any>(this.url + '/api/plans/' + pin, plan);
  }

  updateProductionPlan(pin: string, plan: Plan) {
    return this.http.put<any>(this.url + '/api/plans/' + pin, plan);
  }
}
