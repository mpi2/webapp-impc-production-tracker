import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkGroup } from '../model/organisation/work-group';
import { environment } from 'src/environments/environment';
import {ConfigAssetLoaderService} from './config-asset-loader.service';

@Injectable({
  providedIn: 'root'
})
export class WorkGroupService {

  private url;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.url = data.appServerUrl);
  }

  getAllWorkGroups() {
    return this.http.get<WorkGroup[]>(this.url + '/tracking-api/workGroups');
  }

  getWorkGroupByWorkUnit(name: string) {
    return this.http.get<WorkGroup[]>(this.url + '/api/workGroups?workUnitName=' + name );
  }
}
