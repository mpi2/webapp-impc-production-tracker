import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Project } from '../_models';
import { environment } from 'src/environments/environment';
import { ProjectSummary } from '../_models/project/projectSummary';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAll() {
    console.log('getting all projects');
    return this.http.get<Project[]>(`${environment.baseUrl}/api/projects`);
  }

  getProject(tpn: string) {
    console.log('getting the project ' + tpn);
    return this.http.get<Project>(`${environment.baseUrl}/api/projects/${tpn}`);
  }

  deleteMutagenesisDonor(url: string) {
    console.log('ProjectService::deleteMutagenesisDonor');
    return this.http.delete(url);
  }

  getAllProjectSummariesWithPage(page: number) {
    console.log('Getting all Plan Summaries the user can see with page');
    return this.http.get<ProjectSummary[]>(`${environment.baseUrl}/api/projectSummaries?page=${page}`);
  }
}
