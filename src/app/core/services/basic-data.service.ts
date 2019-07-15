import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ConfigurationData } from '../model/configuration-data';
import { Permission } from '../model/permission';
import { AlleleType, Consortium, Gene, GenesSummary, Institute, WorkGroup, TrackedStrain } from '../model';
import { of } from 'rxjs';
import { ProjectSummary } from 'src/app/projects/model/project-summary';

@Injectable()
export class BasicDataService {
  constructor(private http: HttpClient) { }

  // Returns an object with configuration information: The available work units, work groups, priorities, plan types, etc.
  getConfiguration() {
      return this.http.get<ConfigurationData>(`${environment.baseUrl}/api/conf`);
  }

  // Returns an object with permissions for the logged user.
  getPermissions() {
      return this.http.get<Permission>(`${environment.baseUrl}/api/permissions`);
  }

  

  // Entityes related end points:

  getAllAlleleTypes() {
      return this.http.get<AlleleType[]>(`${environment.baseUrl}/tracking-api/alleleTypes`);
  }

  getAllConsortia() {
      return this.http.get<Consortium[]>(`${environment.baseUrl}/tracking-api/consortia`);
  }

  getAllGenes() {
      return this.http.get<GenesSummary[]>(`${environment.baseUrl}/api/genes`);
  }

  findGeneBySymbol(symbol: string) {
      // if (!symbol || !specie) {
      //     return of([]);
      // }
      return this.http.get<Gene[]>(`${environment.baseUrl}/api/genes?symbol=${symbol}`);
  }

  getAllInstitutes() {
    return this.http.get<Institute[]>(`${environment.baseUrl}/tracking-api/institutes`);
  }

  getAllProyectSummaries() {
    console.log('Getting all Plan Summaries the user can see');
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projectSummaries`);
  }
  getAllProyectsSummariesWithPage(page: number) {
    console.log('Getting all Plan Summaries the user can see with page');
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projectSummaries?page=${page}`);
  }

  getAllWorkGroups() {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/tracking-api/workGroups`);
  }

  getWorkGroupByWorkUnit(name: string) {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/api/workGroups?workUnitName=${name}`);
  }

  // Returns if an action over an object is allowed.
  getPermissionByActionOnResource(action: string, resourceId: string) {
    return this.http.get<boolean>(`${environment.baseUrl}/api/permissionByActionOnResource?action=${action}&resourceId=${resourceId}`);
  }

  getAllFunders() {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/tracking-api/funders`);
  }

  getAllFundersByWorkGroup(name: string) {
    return this.http.get<WorkGroup[]>(`${environment.baseUrl}/api/funders?workGroupName=${name}`);
  }

  getAlltrackedStrains(name: string) {
    return this.http.get<TrackedStrain[]>(`${environment.baseUrl}/tracking-api/trackedStrains`);
  }
}
