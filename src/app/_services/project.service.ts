import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Project } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAll() {
    console.log('getting all projects');
    return this.http.get<Project[]>(`${environment.baseUrl}/api/projectsx`);
  }

  getProject(tpn: string) {
    console.log('getting the project ' + tpn);
    return this.http.get<Project>(`${environment.baseUrl}/api/projects/${tpn}`);
  }
}
