import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkGroup } from '../model/organisation/work-group';
import {ConfigAssetLoaderService} from './config-asset-loader.service';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkGroupService {

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  getAllWorkGroups() {
    return this.http.get<WorkGroup[]>(this.apiServiceUrl + '/tracking-api/workGroups');
  }

  getWorkGroupByWorkUnit(name: string) {
    return this.http.get<WorkGroup[]>(this.apiServiceUrl + '/api/workGroups?workUnitName=' + name );
  }
}
