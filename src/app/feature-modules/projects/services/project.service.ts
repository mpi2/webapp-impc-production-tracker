import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../../model/bio/project';
import { ChangesHistory, ConfigAssetLoaderService, QueryBuilderService } from 'src/app/core';
import { ProjectFilter } from '../model/project-filter';
import { Observable, from } from 'rxjs';
import { Page } from 'src/app/model/page_structure/page';
import { AssetConfiguration } from 'src/app/core/model/conf/asset-configuration';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiServiceUrl;
  filterChange: EventEmitter<ProjectFilter> = new EventEmitter();
  filter: ProjectFilter;
  private config$: Observable<AssetConfiguration>;

  constructor(
    private http: HttpClient,
    private configAssetLoaderService: ConfigAssetLoaderService,
    private queryBuilderService: QueryBuilderService) {
    this.config$ = from(this.configAssetLoaderService.getConfig());
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  public emitFilterChange(filter) {
    this.filter = filter;
    this.filterChange.emit(filter);
  }

  getFilterChange() {
    return this.emitFilterChange;
  }

  getAll() {
    return this.http.get<Project[]>(this.apiServiceUrl + '/api/projects');
  }

  getProject(tpn: string) {
    return this.http.get<Project>(this.apiServiceUrl + '/api/projects/' + tpn);
  }

  postProject(newProject: Project) {
    return this.http.post<Project>(this.apiServiceUrl + '/api/projects/', newProject);
  }

  deleteMutagenesisDonor(url: string) {
    return this.http.delete(url);
  }

  getPaginatedProjectSummaries(page: number) {
    return this.http.get<Project[]>(this.apiServiceUrl + '/api/projects?page=' + page);
  }

  public getProjects(filters: ProjectFilter, page: Page): Observable<Project[]> {
    const queryParameters = this.queryBuilderService.buildQueryParameters(filters, page);
    return this.config$.pipe(flatMap(response => {
      const url = `${response.appServerUrl}/api/projects?${queryParameters}`;
      return this.http.get<Project[]>(url);
    }));
  }

  /**
   * Gets the history of the changes for a project.
   * @param tpn The identifier for the project.
   */
  getHistoryByTpn(tpn: string) {
    return this.http.get<ChangesHistory[]>(this.apiServiceUrl + '/api/projects/' + tpn + '/history');
  }

  public exportCsv(filters: ProjectFilter) {
    const queryParameters = this.queryBuilderService.buildQueryParameters(filters, null);
    let url = this.apiServiceUrl + '/api/projects/exportProjects?';
    url += queryParameters;
    return this.http.get(url, { responseType: 'text' });
  }

  public updateProject(project: Project) {
    const url = this.apiServiceUrl + '/api/projects/' + project.tpn;
    return this.http.put<any>(url, project);
  }
}
