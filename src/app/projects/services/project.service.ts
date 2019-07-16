import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Project } from '../../core/model';
import { environment } from 'src/environments/environment';
import { ProjectSummary } from '../model/project-summary';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Project[]>(`${environment.baseUrl}/api/projects`);
  }

  getProject(tpn: string) {
    return this.http.get<Project>(`${environment.baseUrl}/api/projects/${tpn}`);
  }

  deleteMutagenesisDonor(url: string) {
    return this.http.delete(url);
  }

  getProjectSummaryById(tpn: string) {
    return this.http.get<ProjectSummary>(`${environment.baseUrl}/api/projectSummaries/${tpn}`);
  }

  getPaginatedProjectSummaries(page: number) {
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projectSummaries?page=${page}`);
  }

  getPaginatedProjectSummariesWithFilters(
    page: number,
    markerSymbols: string[],
    workUnits: string[],
    workGroups: string[],
    planTypes: string[],
    statuses: string[],
    priorities: string[],
    privacies: string[]) {

    const queryParameters = this.buildFilterQueryParameters(markerSymbols, workUnits, workGroups, planTypes, statuses, priorities, privacies);
    const url = `${environment.baseUrl}/api/projectSummaries?page=${page}${queryParameters}`;

    return this.http.get<ProjectSummary[]>(url);
  }

  buildFilterQueryParameters(
    markerSymbols: string[],
    workUnits: string[],
    workGroups: string[],
    planTypes: string[],
    statuses: string[],
    priorities: string[],
    privacies: string[]) {

    let markerSymbolsAsParameter = '';
    let workUnitsAsParameter = '';
    let workGroupsAsParameter = '';
    let planTypesAsParameter = '';
    let statusesAsParameter = '';
    let prioritiesAsParameter = '';
    let privaciesAsParameter = '';

    if (markerSymbols.length > 0) {
      markerSymbolsAsParameter = markerSymbols.map(x => 'markerSymbol=' + x).join('&');
    }

    if (workUnits.length > 0) {
      workUnitsAsParameter = workUnits.map(x => 'workUnit=' + x).join('&');
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

    if (priorities.length > 0) {
      prioritiesAsParameter = priorities.map(x => 'priority=' + x).join('&');
    }

    if (privacies.length > 0) {
      privaciesAsParameter = privacies.map(x => 'privacy=' + x).join('&');
    }

    let queryParameters = '';

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
    if (prioritiesAsParameter != '') {
      queryParameters += '&' + prioritiesAsParameter;
    }
    if (privaciesAsParameter != '') {
      queryParameters += '&' + privaciesAsParameter;
    }

    return queryParameters;
  }
}
