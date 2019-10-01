import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProjectSummary } from '../model/project-summary';
import { Project } from '../model/project';
import { NewProject } from '../model/newProject';
import { ChangesHistory } from 'src/app/core';
import {ConfigAssetLoaderService} from '../../../core/services/config-asset-loader.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }


  getAll() {
    return this.http.get<Project[]>(this.apiServiceUrl + '/api/projects');
  }

  getProject(tpn: string) {
    return this.http.get<Project>(this.apiServiceUrl + '/api/projects/' + tpn);
  }

  postProject(newProject: NewProject) {
    return this.http.post<Project>(this.apiServiceUrl + '/api/projects/', newProject);
  }

  deleteMutagenesisDonor(url: string) {
    return this.http.delete(url);
  }

  getPaginatedProjectSummaries(page: number) {
    return this.http.get<ProjectSummary[]>(this.apiServiceUrl + '/api/projects?page=' + page);
  }

  getPaginatedProjectsWithFilters(
    page: number,
    tpn: string,
    markerSymbols: string[],
    workUnits: string[],
    workGroups: string[],
    planTypes: string[],
    statuses: string[],
    privacies: string[]) {

    const queryParameters = this.buildFilterQueryParameters(tpn, markerSymbols, workUnits, workGroups, planTypes, statuses, privacies);
    
    const url = this.apiServiceUrl + '/api/projects?page=' + page + queryParameters;
    console.log(url);

    return this.http.get<ProjectSummary[]>(url);
  }

  buildFilterQueryParameters(
    tpn: string,
    markerSymbols: string[],
    workUnits: string[],
    workGroups: string[],
    planTypes: string[],
    statuses: string[],
    privacies: string[]) {

    let markerSymbolsAsParameter = '';
    let workUnitsAsParameter = '';
    let workGroupsAsParameter = '';
    let planTypesAsParameter = '';
    let statusesAsParameter = '';
    let privaciesAsParameter = '';

    let tpnFilter = '';

    console.log('markerSymbols', markerSymbols);
    

    if (tpn) {
      tpnFilter = 'tpn=' + tpn.toUpperCase();
    }

    if (markerSymbols.length > 0) {
      markerSymbolsAsParameter = markerSymbols.map(x => 'markerSymbol=' + x).filter(x => x).join('&');
    }

    if (workUnits.length > 0) {
      workUnitsAsParameter = workUnits.map(x => 'workUnitName=' + x).join('&');
    }

    if (workGroups.length > 0) {
      workGroupsAsParameter = workGroups.map(x => 'workGroup=' + x).join('&');
    }

    if (planTypes.length > 0) {
      planTypesAsParameter = planTypes.map(x => 'planType=' + x).join('&');
    }

    if (statuses.length > 0) {
      statusesAsParameter = statuses.map(x => 'status=' + x).join('&');
    }

    if (privacies.length > 0) {
      privaciesAsParameter = privacies.map(x => 'privacy=' + x).join('&');
    }

    let queryParameters = '';

    if (tpnFilter != '') {
      queryParameters += '&' + tpnFilter;
    }
    if (markerSymbolsAsParameter != '') {
      queryParameters += '&' + markerSymbolsAsParameter;
    }
    if (workUnitsAsParameter != '') {
      queryParameters += '&' + workUnitsAsParameter;
    }
    if (workGroupsAsParameter != '') {
      queryParameters += '&' + workGroupsAsParameter;
    }
    if (planTypesAsParameter != '') {
      queryParameters += '&' + planTypesAsParameter;
    }
    if (statusesAsParameter != '') {
      queryParameters += '&' + statusesAsParameter;
    }
    if (privaciesAsParameter != '') {
      queryParameters += '&' + privaciesAsParameter;
    }

    return queryParameters;
  }

  /**
   * Gets the history of the changes for a project.
   * @param tpn The identifier for the project.
   */
  getHistoryByTpn(tpn: String) {
    return this.http.get<ChangesHistory[]>(this.apiServiceUrl + '/api/projects/' + tpn + '/history');
    
  }
}
