import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ProjectSummary } from '../model/project-summary';
import { Project } from '../model/project';
import { NewProject } from '../model/newProject';
import { ChangesHistory } from 'src/app/core';

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

  postProject(newProject: NewProject) {
    return this.http.post<Project>(`${environment.baseUrl}/api/projects/`, newProject);
  }

  deleteMutagenesisDonor(url: string) {
    return this.http.delete(url);
  }

  getProjectSummaryById(tpn: string) {
    return this.http.get<ProjectSummary>(`${environment.baseUrl}/api/projectSummaries/${tpn}`);
  }

  getPaginatedProjectSummaries(page: number) {
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projects?page=${page}`);
  }

  getPaginatedProjectsWithFilters(
    page: number,
    markerSymbols: string[],
    workUnits: string[],
    workGroups: string[],
    planTypes: string[],
    statuses: string[],
    privacies: string[]) {

    const queryParameters = this.buildFilterQueryParameters(markerSymbols, workUnits, workGroups, planTypes, statuses, privacies);
    const url = `${environment.baseUrl}/api/projects?page=${page}${queryParameters}`;

    return this.http.get<ProjectSummary[]>(url);
  }

  buildFilterQueryParameters(
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
    return this.http.get<ChangesHistory[]>(`${environment.baseUrl}/api/projects/${tpn}/history`);
    
  }
}
