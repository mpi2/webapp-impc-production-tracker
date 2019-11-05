import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../../model/bio/project';
import { NewProject } from '../model/newProject';
import { ConfigAssetLoaderService } from '../../../core/services/config-asset-loader.service';
import { ChangesHistory } from 'src/app/core';

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
    return this.http.get<Project[]>(this.apiServiceUrl + '/api/projects?page=' + page);
  }

  getPaginatedProjectsWithFilters(
    page: number,
    tpn: string,
    markerSymbols: string[],
    intentions: string[],
    workUnits: string[],
    privacies: string[]) {
    const queryParameters = this.buildFilterQueryParameters(tpn, markerSymbols, intentions, workUnits, privacies);
    const url = this.apiServiceUrl + '/api/projects?page=' + page + queryParameters;
    return this.http.get<Project[]>(url);
  }

  buildFilterQueryParameters(
    tpn: string,
    markerSymbols: string[],
    intentions: string[],
    workUnits: string[],
    privacies: string[]) {

    let markerSymbolsAsParameter = '';
    let intentionsAsParameter = '';
    let workUnitsAsParameter = '';
    let privaciesAsParameter = '';

    let tpnFilter = '';
    if (tpn) {
      tpnFilter = 'tpn=' + tpn.toUpperCase();
    }

    if (markerSymbols.length > 0) {
      markerSymbolsAsParameter = markerSymbols.map(x => 'markerSymbol=' + x).filter(x => x).join('&');
    }

    if (intentions.length > 0) {
      intentionsAsParameter = intentions.map(x => 'intention=' + x).filter(x => x).join('&');
    }

    if (workUnits.length > 0) {
      workUnitsAsParameter = workUnits.map(x => 'workUnitName=' + x).join('&');
    }

    if (privacies.length > 0) {
      privaciesAsParameter = privacies.map(x => 'privacyName=' + x).join('&');
    }

    let queryParameters = '';
    if (tpnFilter !== '') {
      queryParameters += '&' + tpnFilter;
    }
    if (markerSymbolsAsParameter !== '') {
      queryParameters += '&' + markerSymbolsAsParameter;
    }
    if (intentionsAsParameter !== '') {
      queryParameters += '&' + intentionsAsParameter;
    }
    if (workUnitsAsParameter !== '') {
      queryParameters += '&' + workUnitsAsParameter;
    }
    if (privaciesAsParameter !== '') {
      queryParameters += '&' + privaciesAsParameter;
    }
    return queryParameters;
  }

  /**
   * Gets the history of the changes for a project.
   * @param tpn The identifier for the project.
   */
  getHistoryByTpn(tpn: string) {
    return this.http.get<ChangesHistory[]>(this.apiServiceUrl + '/api/projects/' + tpn + '/history');
  }
}
